import requests
import base64

# GitHub Config
GITHUB_TOKEN = "woww"  # Add your GitHub token here
GITHUB_OWNER = "imlovekumar"
GITHUB_REPO = "Loves"
GITHUB_FILE_PATH = "iPl"
GITHUB_COMMIT_MSG = "Update IPTV M3U playlist"

# URLs to fetch
url1 = "https://raw.githubusercontent.com/imlovekumar/Loves/refs/heads/main/mango"
url2 = "https://raw.githubusercontent.com/imlovekumar/Loves/refs/heads/main/4K"
url3 = "https://raw.githubusercontent.com/imlovekumar/Loves/refs/heads/main/info"
url4 = "https://raw.githubusercontent.com/imlovekumar/Loves/refs/heads/main/sony"

# Fetch data from a URL
def fetch_data_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from {url}:\n{e}")
        return ""

# Merge content from both URLs
def merge_content_from_urls(url1, url2,url3,url4):
    data1 = fetch_data_from_url(url1)
    data2 = fetch_data_from_url(url2)
    data3 = fetch_data_from_url(url3)
    data4 = fetch_data_from_url(url4)
    return f"{data1}\n{data2}\n{data3}\n{data4}"

# Update GitHub file
def update_github_file(token, owner, repo, file_path, new_content, commit_message):
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.github+json'
    }
    url = f'https://api.github.com/repos/{owner}/{repo}/contents/{file_path}'

    response = requests.get(url, headers=headers)
    sha = None
    if response.status_code == 200:
        sha = response.json().get('sha')
    elif response.status_code == 404:
        print("File not found. Creating a new one.")
    else:
        print("GitHub GET error:", response.text)
        return

    encoded_content = base64.b64encode(new_content.encode()).decode()
    payload = {
        'message': commit_message,
        'content': encoded_content
    }
    if sha:
        payload['sha'] = sha

    put_response = requests.put(url, headers=headers, json=payload)
    if put_response.status_code in [200, 201]:
        print("GitHub file updated successfully!")
    else:
        print("GitHub PUT error:", put_response.text)

# Run the flow
merged = merge_content_from_urls(url1, url2,url3,url4)
update_github_file(
    token=GITHUB_TOKEN,
    owner=GITHUB_OWNER,
    repo=GITHUB_REPO,
    file_path=GITHUB_FILE_PATH,
    new_content=merged,
    commit_message=GITHUB_COMMIT_MSG
)
