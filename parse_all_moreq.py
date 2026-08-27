import json
import re

def parse_moreq(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by numbers followed by dot e.g. "1. ", "2. ", ... "20. "
    raw_blocks = re.split(r'\n(?=\d+\.\s+)', '\n' + content.strip())
    questions = []

    for block in raw_blocks:
        if not block.strip():
            continue
        lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
        if not lines:
            continue
        
        # Match question number and text
        header_match = re.match(r'(\d+)\.\s*(.*)', lines[0])
        if not header_match:
            continue
        
        q_num = int(header_match.group(1))
        
        # Look for Explanation:
        exp_idx = -1
        for i, line in enumerate(lines):
            if line.startswith('Explanation:'):
                exp_idx = i
                break
        
        if exp_idx == -1:
            continue
            
        q_and_opts = lines[0:exp_idx]
        exp_lines = lines[exp_idx+1:]
        
        # Explanation text (clean up "Comprehensive and Detailed Explanation (200C300 words):")
        clean_exp_lines = []
        for el in exp_lines:
            if 'Comprehensive and Detailed Explanation' in el or el == 'Question was not answered':
                continue
            clean_exp_lines.append(el)
        explanation = ' '.join(clean_exp_lines).replace('―', '—').replace('’', "'").replace('“', '"').replace('”', '"')
        
        # Find where options start. Options usually have 'correct' or 'wrong' at the end or are multiple choice choices
        # Let's find the question text
        q_text_lines = []
        opts_start = -1
        
        # Scan lines to find options
        for i in range(1, len(q_and_opts)):
            line = q_and_opts[i]
            if 'correct' in line.lower() or 'wrong' in line.lower() or line == 'Question was not answered':
                opts_start = i
                # Backtrack one or two lines if earlier lines were also options
                # Options are usually 1 line each
                break
        
        # In moreq.txt:
        # lines[0] is often first line of question
        # lines[1] might be second line of question
        # Then options
        # Let's inspect by question structure
        # If line has "?" it is part of question
        q_lines = [header_match.group(2)]
        opt_lines = []
        found_question_end = False
        
        for l in lines[1:exp_idx]:
            if l == 'Question was not answered':
                continue
            if not found_question_end:
                if '?' in l or not opt_lines:
                    # check if this line is an option
                    if 'correct' in l or 'wrong' in l:
                        found_question_end = True
                        opt_lines.append(l)
                    else:
                        q_lines.append(l)
                        if '?' in l:
                            found_question_end = True
                else:
                    opt_lines.append(l)
            else:
                opt_lines.append(l)
                
        q_full_text = ' '.join(q_lines).strip()
        
        # Clean options and identify correctIndices
        options = []
        correct_indices = []
        
        for idx, opt_raw in enumerate(opt_lines):
            is_correct = 'correct' in opt_raw.lower() and 'wrong' not in opt_raw.lower()
            clean_opt = re.sub(r'(correct|wrong)$', '', opt_raw, flags=re.IGNORECASE).strip()
            clean_opt = re.sub(r'^[A-E][\.\:\)]\s*', '', clean_opt).strip()
            if clean_opt:
                options.append(clean_opt)
                if is_correct:
                    correct_indices.append(len(options) - 1)
        
        # Determine category based on text
        text_lower = (q_full_text + ' ' + explanation).lower()
        if 'csdm' in text_lower or 'business application' in text_lower or 'walk stage' in text_lower or 'information object' in text_lower:
            category = "CSDM & Lifecycle"
        elif 'health dashboard' in text_lower or 'data foundation' in text_lower or 'staleness' in text_lower:
            category = "CMDB Health & Dashboards"
        elif 'data manager' in text_lower or 'attestation' in text_lower or 'certification' in text_lower or 'archive' in text_lower:
            category = "CMDB Data Manager & Governance"
        elif 'discovery' in text_lower or 'service mapping' in text_lower or 'acc' in text_lower or 'agent client collector' in text_lower or 'service graph' in text_lower or 'integrationhub' in text_lower:
            category = "Ingest & Integrations"
        elif 'ire' in text_lower or 'reconciliation' in text_lower or 'duplicate' in text_lower or 'remediator' in text_lower:
            category = "IRE & Reconciliation"
        else:
            category = "CMDB Workspace & Query Builder"
            
        difficulty = "hard" if len(correct_indices) > 1 or len(explanation) > 500 else "medium"
        
        questions.append({
            "source": f"moreq.txt Q{q_num}",
            "category": category,
            "difficulty": difficulty,
            "multiSelect": len(correct_indices) > 1 or "choose 2" in q_full_text.lower(),
            "question": q_full_text,
            "options": options,
            "correctIndices": correct_indices if correct_indices else [0],
            "explanation": explanation
        })
        
    return questions

moreq_parsed = parse_moreq('/Users/piyush.verma1/Library/CloudStorage/OneDrive-ServiceNow/Study/quiz-app/moreq.txt')
print(f"Parsed {len(moreq_parsed)} questions from moreq.txt:")
for q in moreq_parsed:
    print(f"- {q['source']}: {q['question'][:60]}... (Options: {len(q['options'])}, Correct: {q['correctIndices']})")

# Load existing base questions
with open('/Users/piyush.verma1/Library/CloudStorage/OneDrive-ServiceNow/Study/quiz-app/public/questions.json', 'r') as f:
    current = json.load(f)

# Keep all original 125 questions from the 2 PDFs, then append all 20 questions from moreq.txt as a dedicated set
base_125 = [q for q in current if not q.get('source', '').startswith('moreq.txt')]

all_combined = base_125 + moreq_parsed

for idx, q in enumerate(all_combined, start=1):
    q["id"] = idx

with open('/Users/piyush.verma1/Library/CloudStorage/OneDrive-ServiceNow/Study/quiz-app/public/questions.json', 'w') as f:
    json.dump(all_combined, f, indent=2)

multi_cnt = sum(1 for q in all_combined if q.get('multiSelect'))
print(f"\nSuccessfully written {len(all_combined)} total questions ({multi_cnt} multi-select) to public/questions.json")
