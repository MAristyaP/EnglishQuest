import subprocess
from pathlib import Path
p=Path(__file__).parent
for i in range(3):
 r=subprocess.run([r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe','--headless','--disable-gpu','--no-first-run','--user-data-dir='+str(p/'browser-report-preview'),'--hide-scrollbars','--force-device-scale-factor=1','--window-size=1240,1754','--virtual-time-budget=4000','--screenshot='+str(p/f'preview-report-{i}.png'),f'http://127.0.0.1:8765/preview-report.html?page={i}'],capture_output=True,timeout=35)
 print(i,(p/f'preview-report-{i}.png').exists())
