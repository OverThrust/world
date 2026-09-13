from __future__ import annotations
from http.server import BaseHTTPRequestHandler
from pathlib import Path
import base64, copy, hashlib, importlib.util, json, sys, tempfile, threading, zipfile, zlib

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
PARTS=ROOT/'brain_parts'
BUNDLE_SHA256='62067e5fe899e9129573ec7bf0370fd8e69efc655efda6728fb32a9c1dc8cd4b'
CACHE=Path('/tmp/fabric-rp341-'+BUNDLE_SHA256[:12])
MAX_MESSAGE_CHARS=4000
MAX_TOKEN_CHARS=2_000_000
MAX_DECOMPRESSED=20_000_000
_LOCK=threading.RLock()

def _brain():
    ready=CACHE/'READY'
    if ready.is_file() and ready.read_text()==BUNDLE_SHA256:return CACHE
    with _LOCK:
        if ready.is_file() and ready.read_text()==BUNDLE_SHA256:return CACHE
        encoded=''.join(p.read_text() for p in sorted(PARTS.glob('part*.txt')))
        packed=base64.b64decode(encoded.encode('ascii'))
        if hashlib.sha256(packed).hexdigest()!=BUNDLE_SHA256:raise RuntimeError('RP341 interaction bundle hash mismatch')
        CACHE.mkdir(parents=True,exist_ok=True);bundle=CACHE/'brain_bundle.zip';bundle.write_bytes(packed)
        with zipfile.ZipFile(bundle) as z:
            for info in z.infolist():
                target=(CACHE/info.filename).resolve()
                if not target.is_relative_to(CACHE.resolve()):raise RuntimeError('bundle path escape')
            z.extractall(CACHE)
        ready.write_text(BUNDLE_SHA256)
    return CACHE

def _load_module(name,path):
    if name in sys.modules:return sys.modules[name]
    spec=importlib.util.spec_from_file_location(name,path)
    if spec is None or spec.loader is None:raise RuntimeError('cannot import RP341 runtime')
    mod=importlib.util.module_from_spec(spec);sys.modules[name]=mod;spec.loader.exec_module(mod);return mod

def _encode(raw):return base64.urlsafe_b64encode(zlib.compress(raw,9)).decode('ascii')
def _decode(token):
    if not isinstance(token,str) or not token or len(token)>MAX_TOKEN_CHARS:raise ValueError('invalid state token')
    try:
        packed=base64.urlsafe_b64decode(token.encode('ascii'));obj=zlib.decompressobj();raw=obj.decompress(packed,MAX_DECOMPRESSED+1);raw+=obj.flush()
    except Exception as exc:raise ValueError('invalid compressed state token') from exc
    if len(raw)>MAX_DECOMPRESSED:raise ValueError('state token expands beyond limit')
    return raw

def initial_payload():
    brain=_brain()
    return {'status':'READY','build':'RP341-v1.32.10-qualified-interaction-preview','qualified_baseline':'RP341 / v1.32.10','experimental_surface':True,'not_rp342':True,'state_token':_encode(zlib.decompress((brain/'child.json.z').read_bytes())),'room_token':_encode(zlib.decompress((brain/'room.json.z').read_bytes())),'notice':'Qualified RP341 interaction baseline. Segment 2 and the full cognitive loop are not yet complete.'}

def _write_state(directory,state_token,room_token):
    child=json.loads(_decode(state_token));room=json.loads(_decode(room_token))
    if child.get('child_id')!='FABRIC-CHILD-0001':raise ValueError('state token does not belong to the qualified child')
    if not isinstance(room,dict):raise ValueError('invalid room state')
    cp=directory/'child.json';rp=directory/'room.json';cp.write_text(json.dumps(child,separators=(',',':'),ensure_ascii=False));rp.write_text(json.dumps(room,separators=(',',':'),ensure_ascii=False));return cp,rp

def process_turn(message,state_token,room_token):
    if not isinstance(message,str):raise ValueError('message must be text')
    message=message.strip()
    if not message:raise ValueError('message is empty')
    if len(message)>MAX_MESSAGE_CHARS:raise ValueError('message is too long')
    with _LOCK:
        brain=_brain();engine_mod=_load_module('fabric_preview_learning_room_engine',brain/'fabric_digital_learning_room_engine_v0_26_segment1_delivery.py')
        with tempfile.TemporaryDirectory(prefix='fabric-rp341-') as td:
            d=Path(td);cp,rp=_write_state(d,state_token,room_token)
            room=engine_mod.DigitalLearningRoomEngine(runtime_path=brain/'fabric_unified_digital_child_v1_32_10_segment1_references_delivery.py',working_child_state_path=cp,working_room_state_path=rp,sample_registry_path=brain/'fabric_learning_room_samples_v0_1.json')
            before=room.state();turn=room.talk(message);after=room.state()
            return {'status':'OK','reply':turn.get('reply') or turn.get('fabric') or '','fabric':turn.get('fabric') or turn.get('reply') or '','child_id':turn.get('child_id') or after.get('child_id'),'clock_before':before.get('clock'),'clock_after':after.get('clock'),'live_state':copy.deepcopy(turn.get('live_state') or after.get('live_state')),'background_preconscious':copy.deepcopy(turn.get('background_preconscious') or after.get('background_preconscious')),'state_token':_encode(cp.read_bytes()),'room_token':_encode(rp.read_bytes()),'build':'RP341-v1.32.10-qualified-interaction-preview','qualified_baseline':'RP341 / v1.32.10','experimental_surface':True,'not_rp342':True}

def _body(v):return json.dumps(v,separators=(',',':'),ensure_ascii=False).encode()
class handler(BaseHTTPRequestHandler):
    def _send(self,code,value):
        body=_body(value);self.send_response(code);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
    def do_GET(self):
        try:self._send(200,initial_payload())
        except Exception as e:self._send(500,{'status':'ERROR','error':type(e).__name__,'message':str(e)})
    def do_POST(self):
        try:
            n=int(self.headers.get('Content-Length','0'))
            if n<=0 or n>4_000_000:raise ValueError('invalid request size')
            d=json.loads(self.rfile.read(n));self._send(200,process_turn(d.get('message',''),d.get('state_token',''),d.get('room_token','')))
        except ValueError as e:self._send(400,{'status':'ERROR','error':'INVALID_REQUEST','message':str(e)})
        except Exception as e:self._send(500,{'status':'ERROR','error':type(e).__name__,'message':str(e)})
