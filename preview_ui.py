from pathlib import Path
import subprocess

root=Path(__file__).resolve().parent
for name,size,page in [('workshop-desktop','1440,2100','workshop'),('order-mobile','600,2100','order'),('evidence-mobile','600,2100','evidence'),('editor-mobile','600,2100','edit'),('dialogue-desktop','1440,2100','dialogue'),('dictionary-desktop','1440,2100','dictionary')]:
    result=subprocess.run([
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless','--disable-gpu','--no-first-run',
        '--user-data-dir='+str(root/'browser-ui-check'),
        '--hide-scrollbars','--force-device-scale-factor=1',
        '--window-size='+size,'--virtual-time-budget=2500',
        '--screenshot='+str(root/('preview-'+name+'.png')),
        'http://127.0.0.1:8765/preview-workshop.html?page='+page+('&mobile=1' if 'mobile' in name else '')
    ],capture_output=True,timeout=40)
    path=root/('preview-'+name+'.png')
    print(name, 'screenshot saved' if path.exists() else 'FAILED')
    if not path.exists():
        print(result.stderr.decode('utf-8',errors='replace')[-1000:])
        raise SystemExit(1)
