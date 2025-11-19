/**
 * This program makes a get request to an external url,
 * checks the contents of the url,
 * exits with code 0 if the contents match a keyword, otherwise exits with code 1.
 *
 * run with the following env variable:
 * DENO_TLS_CA_STORE=system
 *
 * needs the following permissions:
 * net: gist.githubusercontent.com:443
 * net: gist.github.com:443
 */

const origin = "https://gist.githubusercontent.com";
const url_path = `${Deno.env.get("BYE_GITHUB_USERNAME")}/${Deno.env.get("BYE_GIST_ID")}`;
const raw_path = `raw/{{COMMIT_ID}}/${Deno.env.get("BYE_GIST_FILE")}`;

const CONTENT_URL = `${origin}/${url_path}`;

const KEYWORD = Deno.env.get("BYE_KEYWORD");

// make date more human friendly
console.log(new Date().toLocaleString(), 'starting check');

/**
 * @param {string} text
 * @returns {string}
 */
function getLatestCommitId(text) {
    const RE = new RegExp(`/${url_path}/raw/([a-zA-Z0-9]+)/answer\\.txt`);
    const [, id] = text.match(RE);
    return id;
}

/**
 * @param {string} commitId
 */
async function checkUrl(commitId) {
    const raw = raw_path.replace("{{COMMIT_ID}}", commitId);
    const response = await fetch(`${origin}/${url_path}/${raw}`);
    const text = await response.text();
    console.log('current keyword', text);
    if (text.trim().includes(KEYWORD)) {
        console.log("keyword found, exiting with code 0");
        Deno.exit(0);
    } else {
        console.log("keyword not found, exiting with code 1, no further action");
        Deno.exit(1);
    }
}


try {
    const response = await fetch(CONTENT_URL);
    if (response.ok) {
        const text = await response.text();
        const commitId = getLatestCommitId(text);
        await checkUrl(commitId);
    } else {
        console.error("ERROR", response.status);
    }
} catch (e) {
    console.error(e);
}
// if we reach here, something went wrong
 Deno.exit(1);
