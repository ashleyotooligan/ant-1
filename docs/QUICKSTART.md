# Open ANT-1

## Easiest option: double-click the application

1. Extract the ZIP completely.
2. Open the extracted `ant-1` folder.
3. Double-click `ANT-1.html`.
4. Use **Pause**, **Step +1**, the rate selector, and the five navigation views.

This file contains the application's code and reference data. It works offline in a modern desktop browser. If the operating system opens it in an editor, use **Open with → Chrome, Edge, Firefox, or Safari**. An in-app attachment preview may not execute HTML; download it and open the actual file.

Use **Export run** before closing if you want to preserve a session. Reloading starts a new run. The application does not save sessions automatically.

## Work with the modular source

Open a terminal in the extracted folder. Choose one option:

```bash
# Python 3
python start_ant1.py

# On systems where Python is named python3
python3 start_ant1.py

# Or Node.js 22+
npm start
```

On Windows with Python installed, double-click `Start-ANT1.bat`. It first tries the Windows Python launcher and then `python`.

The local address is `http://127.0.0.1:8000`. Keep the terminal open. Stop the server with **Ctrl+C**, then close the terminal. No application is installed as a service.

If port 8000 is in use:

```bash
python start_ant1.py --port 8001
```

Open `http://127.0.0.1:8001` if the browser does not open automatically. The server binds only to your own computer.

## A first five-minute session

- Watch the ant reach the food and return to the nest. Choose 12× to accelerate simulated time.
- Pause and open **Neural interface**. Step once and watch the input and recurrent layers change.
- Click **Silence left antenna**, resume, and inspect the altered route.
- Reset to seed 17. Open **Experiments** and compare Navigation with Frozen readout and No steering prior.
- Open **Run archive** to reproduce a supplied reference run.
- If interested, open **External tasks** to run the optional paper comparison.

Reset preserves the selected seed but creates a fresh controller. Changing the seed field takes effect when resetting or running a new protocol/comparison, not halfway through a running observation.

## Tests and experiments

Node.js is needed for the command-line tools, but not for opening `ANT-1.html`.

```bash
npm test
npm run experiment -- --protocol relocation --seed 31
npm run benchmark
npm run replay -- --file data/runs/navigation-seed17.json
npm run build
```

There is no required `npm install` step. Outputs go to `output/`, which is ignored by Git. After editing source code, rebuild `ANT-1.html` with `npm run build` to update the standalone edition.
