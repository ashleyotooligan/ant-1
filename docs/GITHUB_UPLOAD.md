# Upload ANT-1 to your GitHub account

## Repository details

| Field | What to enter |
| --- | --- |
| Owner | Select your own account in GitHub's Owner menu. Use the exact username shown there. |
| Repository name | `ant-1` |
| Description | `An embodied neural experiment connecting a simulated ant, a synthetic recurrent controller, and controlled environments.` |
| Visibility | Public if you want everyone to see the experiment |
| Initialise README | Leave off; the package already contains one |
| Add .gitignore | None; already included |
| Choose a licence | None during creation; MIT is already included |

The market extension appears later in the README. The main repository description and images focus on the ant and its neural interface.

## Upload through GitHub in your browser

1. Download `ANT-1-repository.zip` and extract it. On Windows: right-click the ZIP → **Extract All**. Open the extracted `ant-1` folder.
2. Sign in to GitHub with your account. Open the **+** menu and choose **New repository**.
3. Enter the details above and click **Create repository**.
4. On the empty repository page, choose **uploading an existing file**. For a repository that already has a file, use **Add file → Upload files**.
5. Open the extracted `ant-1` folder on your computer. Select **the contents inside it**: `README.md`, `ANT-1.html`, `src`, `assets`, `docs`, `experiments`, `extensions`, `data`, `scripts`, `tests`, and the remaining files. Drag those contents into the upload area. Preserve the folders. Do not upload the ZIP itself, and do not put the outer `ant-1` folder inside the repository.
6. Wait until every file finishes uploading. Enter the commit message **Initial ANT-1 experiment release**.
7. Choose **Commit changes**.

Your repository root should immediately show `README.md`, `ANT-1.html`, `src/`, `assets/`, and the other source folders. The illustrated README should appear underneath the file list. If you see only one folder named `ant-1`, you uploaded one level too high; move/upload the contents into the repository root.

The package is kept below GitHub's 100-file browser batch limit, and every file is below the 25 MiB per-file browser limit. If your browser does not accept folder drops, use GitHub Desktop as described below. [Official upload instructions](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

## Include the GitHub configuration

The package also includes `.github/`, `.gitignore`, and `.gitattributes`. These enable automated tests, issue templates and consistent source handling. Some file managers hide names starting with a dot. On macOS, **Command+Shift+.** reveals them. Include them in the upload, or use GitHub Desktop to preserve the entire tree.

If these files were omitted, the app and README still work; the repository automation and templates will be missing. Upload them in a second batch if necessary.

## GitHub Desktop alternative

1. Create the empty `ant-1` repository on GitHub.
2. In GitHub Desktop, choose **File → Clone repository** and select it.
3. Open the cloned folder in your file manager.
4. Copy the contents of the extracted `ant-1` folder into the cloned folder. Preserve all subfolders and configuration files.
5. In GitHub Desktop, review the changes. Use **Initial ANT-1 experiment release** as the summary.
6. Click **Commit to main**, then **Push origin**.

For later updates, edit or replace only the intended files, review the diff, commit, and push again. Rebuild `ANT-1.html` with `npm run build` whenever you change the modular application source.

## After upload

- In the repository's **About** panel, add the description and optional topics: `artificial-life`, `embodied-ai`, `neural-networks`, `simulation`, `reinforcement-learning`, `ant`.
- Open the README and confirm its images load. Relative links depend on keeping the supplied folder structure.
- Check the **Actions** tab for the included reproducibility workflow if `.github/` was uploaded.
- Keep `ANT-1.html` in the repository. Visitors can download the project and open it locally.
- Uploading source does not automatically host a website. No hosted URL is configured or claimed in this package.

The figures are direct model renders, labeled accurately. If you want console screenshots from your own computer, follow [SCREENSHOT_GUIDE.md](SCREENSHOT_GUIDE.md).
