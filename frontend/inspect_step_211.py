import json
transcript_path = r"C:\Users\hp\.gemini\antigravity\brain\7e2db9cb-6ba0-4434-a527-9031d82fdd9c\.system_generated\logs\transcript.jsonl"
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        step = json.loads(line)
        if step.get("step_index") == 211:
            tool_calls = step.get("tool_calls", [])
            for call in tool_calls:
                args = call.get("args", {})
                code = args.get("CodeContent", "")
                print(f"Length: {len(code)}")
                print(code[:2000])
            break
