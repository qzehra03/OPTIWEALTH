import json

transcript_path = r"C:\Users\hp\.gemini\antigravity\brain\7e2db9cb-6ba0-4434-a527-9031d82fdd9c\.system_generated\logs\transcript.jsonl"

all_steps = []
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        all_steps.append(json.loads(line))

refactor_step = 196
onboard_path = "c:/Users/hp/Downloads/OPTIWEALTH/frontend/app/onboard/page.tsx"

def normalize(path):
    path = path.strip('"\'')
    path = path.replace("\\", "/")
    while "//" in path:
        path = path.replace("//", "/")
    return path.lower()

def decode_content(content):
    if not isinstance(content, str):
        return content
    # Strip leading/trailing quotes if they represent a string constant
    if content.startswith('"') and content.endswith('"'):
        content = content[1:-1]
    # Decode unicode escapes like \n, \", etc.
    try:
        content = content.encode('utf-8').decode('unicode-escape')
    except Exception as e:
        print(f"Failed unicode-escape: {e}")
    # Strip any extra outer quotes if they were double-escaped
    if content.startswith('"') and content.endswith('"'):
        content = content[1:-1]
    return content

for step in reversed(all_steps):
    if step.get("step_index") >= refactor_step:
        continue
    tool_calls = step.get("tool_calls", [])
    for call in tool_calls:
        if call.get("name") == "write_to_file":
            args = call.get("args", {})
            t_file = normalize(args.get("TargetFile", ""))
            if "onboard/page.tsx" in t_file:
                raw_content = args.get("CodeContent")
                decoded = decode_content(raw_content)
                print("Decoded onboard/page.tsx:")
                print(decoded[:200])
                break
