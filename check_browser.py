import subprocess
from pathlib import Path
import re
import sys

root=Path(__file__).resolve().parent
for page in (sys.argv[1:] or ['verify-v2-browser.html','verify-v3-browser.html','verify-v4-browser.html','verify-v5-browser.html','verify-v6-browser.html','verify-v7-browser.html']):
    result=subprocess.run([
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless','--disable-gpu','--no-first-run',
        '--user-data-dir='+str(root/'browser-interaction-v4'),
        '--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream',
        '--autoplay-policy=no-user-gesture-required',
        '--virtual-time-budget=20000','--dump-dom',
        'http://127.0.0.1:8765/'+page
    ],capture_output=True,timeout=45)
    html=result.stdout.decode('utf-8',errors='replace')
    match=re.search(r'<pre id="result">(.*?)</pre>',html,re.S)
    print(page+': '+(match.group(1) if match else 'FAIL: browser produced no test result'))
    if not match or not match.group(1).startswith('PASS:'):
        raise SystemExit(1)
