# AORR Execution Document

Target project: `asfaca/suwan-eai.github.io`

Goal: build a static personal professional website for GitHub Pages, with a responsive mobile layout and a `Games` tab that includes a snake game controllable by keyboard and mobile touch.

Required root files:

- `index.html`
- `styles.css`
- `script.js`

The site must run with HTML, CSS, and JavaScript only. No backend.

## 1. Target

- Create a personal professional website that can be published on GitHub Pages
- Support mobile and desktop layouts
- Add a top-level `Games` tab
- Implement a snake game with keyboard control and mobile touch control
- Keep the site static and deployable as a GitHub Pages project

## 2. AORR State Machine

Use the following states:

- `READY`
- `ACTING`
- `VERIFYING`
- `RETRYING`
- `PASSED`
- `DEPLOY_READY`
- `DEPLOYING`
- `DEPLOYED`
- `BLOCKED`
- `HITL_REQUIRED`

### State rules

#### `READY`

- Preconditions:
  - The current loop target is known
  - Input data for the loop is available
  - Scope is small enough for one pass
- Action:
  - Select exactly one minimal task for this loop
- Next state:
  - `ACTING`
  - `HITL_REQUIRED` if required input is missing

#### `ACTING`

- Preconditions:
  - One concrete task has been selected
- Action:
  - Make the smallest possible implementation change
  - Change only the files required for that loop
- Next state:
  - `VERIFYING`

#### `VERIFYING`

- Preconditions:
  - A concrete change has been made
- Action:
  - Run local verification
  - Check console, layout, navigation, and game behavior as needed
- Next state:
  - `PASSED` if the loop passes
  - `RETRYING` if one failure fingerprint remains fixable
  - `BLOCKED` if the same failure repeats or external input is required

#### `RETRYING`

- Preconditions:
  - One failure fingerprint has been identified
- Action:
  - Fix only that fingerprint
- Next state:
  - `ACTING`

#### `PASSED`

- Preconditions:
  - The loop’s acceptance criteria are satisfied
- Action:
  - Record what passed
  - Decide whether the project is ready for the next loop or deployment
- Next state:
  - `READY` for the next loop
  - `DEPLOY_READY` when all development loops are complete

#### `DEPLOY_READY`

- Preconditions:
  - All required development loops are complete
- Action:
  - Prepare GitHub Pages deployment
  - Confirm repository and path assumptions
- Next state:
  - `DEPLOYING`

#### `DEPLOYING`

- Preconditions:
  - Deployment has been approved
- Action:
  - Publish to GitHub Pages
  - Verify the public URL
- Next state:
  - `DEPLOYED` if the public site works
  - `BLOCKED` if deployment fails

#### `DEPLOYED`

- Preconditions:
  - The GitHub Pages site responds correctly
- Action:
  - Perform a final smoke test
- Next state:
  - End

#### `BLOCKED`

- Preconditions:
  - A failure cannot be resolved in the current loop
  - The same failure fingerprint has repeated
  - Or a required external decision is missing
- Action:
  - Stop the loop
  - Separate the blocker into a human decision or a smaller repair task
- Next state:
  - `HITL_REQUIRED`

#### `HITL_REQUIRED`

- Preconditions:
  - A human decision is needed
- Action:
  - Ask for the missing decision or content
- Next state:
  - `READY` after the input is supplied

## 3. Loop Format

Every loop must follow this order:

1. Input
2. Act
3. Observe
4. Reason
5. Repeat
6. Stop
7. Human-in-the-loop

### Input

Collect only the minimum information needed for the current loop.

### Act

Make one small change only.

### Observe

Check what changed and whether the result matches the expected outcome.

### Reason

Classify failures using one of the fingerprints below:

- `HTML_STRUCTURE`
- `CSS_RESPONSIVE`
- `JAVASCRIPT`
- `GAME_LOGIC`
- `GAME_CONTROL`
- `CONTENT`
- `TEST`
- `ENVIRONMENT`
- `GITHUB_PERMISSION`
- `DEPLOYMENT`
- `UNKNOWN`

### Repeat

- Fix only the current failure fingerprint
- Do not expand the scope
- Re-run the same verifier after the fix

### Stop

Stop the loop if any of the following happens:

- The current loop passed
- The retry limit is reached
- The same failure fingerprint appears twice in a row
- A decision about personal content is required
- A GitHub permission or deployment issue appears

### Human-in-the-loop

Ask the user when any of these are true:

- Name, bio, experience, project content, or contact content is missing
- A design direction must be chosen
- The site structure should change in a way that affects user-facing behavior
- The GitHub Pages setup must be changed
- Game rules conflict

## 4. Recommended Loop Sequence

### Loop 0: Requirements contract

Purpose:

- Define the site map
- Decide the `Games` tab structure
- Confirm the public content to use
- Decide whether `Games` is a section or a separate page

Input:

- Existing repository state
- Personal profile content
- Desired sections
- Game control preference

Act:

- Write the minimum site map and content contract

Observe:

- Missing content
- Conflicting decisions
- Scope that is too large

Test:

- Every section has a purpose
- Every required piece of content has an owner

### Loop 1: Static shell

Purpose:

- Create the base HTML structure
- Add semantic sections
- Wire the main navigation

Input:

- Approved site map

Act:

- Implement `index.html`, `styles.css`, and `script.js`

Observe:

- Page loads
- Navigation works
- Console is clean

Test:

- No runtime error
- No broken links
- Root files exist

### Loop 2: Content integration

Purpose:

- Add professional website copy
- Populate sections with real content

Input:

- Approved bio, career summary, projects, and contact info

Act:

- Insert content and metadata

Observe:

- Readability
- Missing content
- Tone mismatch

Test:

- No placeholder text
- Links are valid
- Metadata is present

### Loop 3: Responsive layout

Purpose:

- Make the site work on mobile

Input:

- Static shell and content

Act:

- Add mobile-first styles and breakpoints

Observe:

- 320px, 375px, 768px, and desktop layouts
- Horizontal overflow
- Touch target size

Test:

- No horizontal scroll
- Content remains readable
- Navigation remains usable on touch devices

### Loop 4: Games entry

Purpose:

- Add the `Games` tab and game entry behavior

Input:

- Navigation layout and page structure

Act:

- Add the `Games` link or section

Observe:

- Direct navigation
- Back button behavior
- Active tab state

Test:

- No 404
- Game entry is reachable

### Loop 5: Snake core

Purpose:

- Implement the snake game logic

Input:

- Game rules
- Grid size
- Scoring rules

Act:

- Implement movement, food, growth, collision, and restart

Observe:

- Deterministic state transitions
- Collision handling

Test:

- Opposite direction turn prevention
- Food does not spawn on the snake
- Wall and self-collision work
- Score updates correctly

### Loop 6: Keyboard and touch control

Purpose:

- Make the game playable on desktop and mobile

Input:

- Snake core

Act:

- Connect arrow keys, optional WASD, and mobile touch control

Observe:

- Input latency
- Scroll conflict
- Gesture reliability

Test:

- Keyboard control works
- Mobile control works
- Page scrolling is not broken during play

### Loop 7: UX and accessibility

Purpose:

- Make the game and the site comfortable to use

Input:

- Working site and game

Act:

- Add instructions, score, pause/restart, and accessible labels

Observe:

- Focus order
- Contrast
- Reduced motion behavior

Test:

- Keyboard-only play is possible
- Screen-reader labels exist where needed
- Controls are understandable

### Loop 8: Integration QA

Purpose:

- Verify the whole static website

Input:

- Completed site

Act:

- Run final smoke checks

Observe:

- HTML, CSS, JavaScript, game, and navigation behavior

Test:

- No console errors
- No broken layout
- No broken asset paths

### Loop 9: Deployment

Purpose:

- Publish to GitHub Pages

Input:

- Fully passing local site

Act:

- Deploy the static site

Observe:

- Public URL behavior
- GitHub Pages path behavior

Test:

- Site loads publicly
- All sections render
- Games load correctly

## 5. Human-in-the-Loop Checkpoints

Pause and ask the user when any of these are unresolved:

- Public name or identity
- Bio and career summary
- Project list
- Contact information
- Visual style direction
- `Games` tab placement
- Snake game control preference
- GitHub Pages repository and publishing setup
- Any conflict between content and design scope

## 6. First Loop Recommendation

Start with `Loop 0: Requirements contract`.

Why:

- The repository is effectively empty
- The highest-risk decisions are content and structure, not implementation
- Solving those first prevents rework in later loops

## 7. Output Contract

The final static site should eventually include at least:

- `index.html`
- `styles.css`
- `script.js`

The project should remain deployable as a GitHub Pages static website.

## 8. Self-Correcting TDD Loop

This section defines the verifier-first loop for the current project snapshot.

### 8.1 Current repository snapshot

At the time of writing, the target repository contains only:

- `README.md`
- `AORR.md`

The required runtime files do not exist yet:

- `index.html`
- `styles.css`
- `script.js`

So the first verifier pass must be file-structure driven, not behavior driven.

### 8.2 Verified tools in the current environment

Confirmed available:

- `dotnet`
- Codex file inspection tools
- Codex browser-based verification tools

Confirmed unavailable in the current environment:

- `python`
- `python3`
- `py`
- `node`
- `npm`
- `claude`

Do not invent a command that is not confirmed here.

### 8.3 Verifier ladder

Use verifiers in this order:

1. File-system verifier
2. Static HTML/CSS/JS verifier
3. Browser verifier
4. Optional local server verifier only when a real server command is confirmed
5. Claude Code CLI verifier only when the CLI is installed and usable

If a verifier is not available, record it as unavailable instead of substituting a made-up command.

### 8.4 Claude Code CLI policy

If Claude Code CLI becomes available later:

- Check whether Sonnet 5 is available first
- Use Sonnet 5 only if the CLI actually reports it as available
- If Sonnet 5 is not available, use the currently available Sonnet model reported by the CLI
- Record the exact model name used
- Do not guess the model name

If Claude Code CLI is not installed, skip that verifier and use the browser/file verifiers instead.

### 8.5 TDD loop states

Use this smaller loop inside each AORR loop:

- `DISCOVER`
- `BASELINE`
- `ACT`
- `VERIFY`
- `REPAIR`
- `PASS`
- `STOP`

#### `DISCOVER`

- Collect the minimum real tools that exist in this environment
- Confirm repo shape and current file presence
- Confirm whether local server and CLI verifiers are available

#### `BASELINE`

- Record the current state before any change
- Capture the expected failure if a required file is missing

#### `ACT`

- Make one minimal change
- Change only the files required by the current retry

#### `VERIFY`

- Run the smallest relevant verifier
- Prefer deterministic checks first
- Prefer browser checks only when file checks are not enough

#### `REPAIR`

- Fix only one root cause
- Keep all already-passing behavior intact
- Never relax the test or delete the verifier

#### `PASS`

- The current retry goal is satisfied
- The failure fingerprint is resolved

#### `STOP`

- The same fingerprint appears twice in a row
- Retry budget is exhausted
- The problem is environment, permission, or deployment related
- Human input is required

### 8.6 Verification matrix

#### 8.6.1 Basic file verification

Verifier:

- File-system inspection

Checks:

- Root `index.html` exists
- CSS and JavaScript are linked from `index.html`
- No bad local-only file path is used in public assets
- No case-mismatched path is referenced
- No absolute local filesystem path is referenced for public GitHub Pages assets

Failure fingerprint:

- `HTML_STRUCTURE`
- `ENVIRONMENT`

#### 8.6.2 HTML verification

Verifier:

- File inspection first
- Browser DOM inspection when the page is runnable

Checks:

- Basic document structure is valid
- `title` exists
- `meta viewport` exists
- Semantic tags are used
- Navigation links exist and point to real targets
- `Games` area exists
- Image `alt` attributes exist
- Internal links are not broken

Failure fingerprint:

- `HTML_STRUCTURE`
- `CONTENT`

#### 8.6.3 CSS verification

Verifier:

- Browser viewport inspection

Checks:

- Desktop layout
- Tablet layout
- Mobile layout
- No horizontal scroll
- Navigation remains usable
- `Games` UI remains responsive

Preferred viewport checkpoints:

- about `375px`
- about `768px`
- about `1440px`

Failure fingerprint:

- `CSS_RESPONSIVE`

#### 8.6.4 JavaScript verification

Verifier:

- Browser console inspection

Checks:

- No syntax error
- No console error
- No `null` DOM reference
- No duplicate event listener behavior
- No load-time error

Failure fingerprint:

- `JAVASCRIPT`

#### 8.6.5 Snake game verification

Verifier:

- Browser interaction

Checks:

- Game can start
- Game can pause
- Game can restart
- Score increases
- Food spawns
- Wall collision works
- Self-collision works
- Keyboard arrow keys or WASD work
- Mobile button or touch input works
- Immediate reverse direction is prevented
- Opening `Games` again does not create duplicate game loops

Failure fingerprint:

- `GAME_LOGIC`
- `GAME_CONTROL`

#### 8.6.6 Local execution verification

Verifier:

- Only a real local static server command that exists in this environment

Checks:

- HTTP response is returned
- `index.html` loads
- CSS responds
- JavaScript responds

Current environment note:

- `python3 -m http.server` is not available right now because `python3` is not installed
- Do not replace it with an invented command

Failure fingerprint:

- `ENVIRONMENT`
- `TEST`

#### 8.6.7 Browser verification

Verifier:

- Codex browser-based checks

Checks:

- Mobile viewport around `375px`
- Tablet viewport around `768px`
- Desktop viewport around `1440px`
- Layout stays stable across the three widths

Failure fingerprint:

- `CSS_RESPONSIVE`
- `JAVASCRIPT`
- `GAME_CONTROL`

#### 8.6.8 GitHub Pages compatibility verification

Verifier:

- File inspection
- Browser public-path logic review

Checks:

- Root `index.html`
- Relative asset paths only
- No server-only feature use
- No local filesystem dependency
- No backend API dependency

Failure fingerprint:

- `ENVIRONMENT`
- `DEPLOYMENT`

### 8.7 Failure log contract

Every failed retry must record:

- Command or verifier used
- Exit code
- Failed verification item
- Core error message
- Related file and line
- Browser console message if present
- Error fingerprint

### 8.8 Retry policy

- One retry may address only one fingerprint
- Modify only files related to that fingerprint
- Do not remove or weaken the verifier
- Do not rewrite unrelated parts of the site
- Do not switch frameworks
- Maximum of 3 retries per error
- If the same fingerprint repeats twice in a row, stop and escalate

### 8.9 Human escalation points

Stop and ask for human input when:

- Content or identity information is missing
- `Games` structure is still undecided
- Touch control design is ambiguous
- GitHub Pages setup or repository ownership is unclear
- A permission or environment problem cannot be solved in code

### 8.10 Recommended Self-Correcting TDD sequence

1. Inspect the current repository and confirm available tools
2. Verify file structure and required root files
3. Verify HTML structure
4. Verify CSS responsiveness at mobile, tablet, and desktop widths
5. Verify JavaScript load behavior
6. Verify game behavior
7. Verify GitHub Pages compatibility
8. Only then verify deployment

### 8.11 Recommended first verifier

Start with file-system verification.

Reason:

- It is deterministic
- It works even when no local server exists
- It exposes missing root files early
- It gives the cleanest baseline for later retries

## 9. Change Request Loop Plan

Current status: `HITL_REQUIRED`

Change Request ID: `CR-2026-07-14-001`

### Loop CR-001

- Loop ID: `CR-L1`
- Connected Change Item: `CR-001`
- Target: Replace public-facing `[사람 확인 필요]` placeholders in `index.html`
- Input materials: Verified profile facts from the user, approved public wording
- Act: Replace placeholder copy with verified content only
- Observe: Render the site and confirm placeholders are removed from the public profile sections
- Reason: `CONTENT`
- Verifier: Browser render + DOM text inspection
- Completion criteria: No placeholder text remains in public-facing profile sections
- Retry policy: One content source issue per retry, maximum 3 retries
- Stop conditions: Missing source facts, conflicting instructions, or repeated content-fingerprint failure
- HITL conditions: No verified personal profile facts have been supplied
- Expected files: `index.html`
- Predecessor: none
- Next loop: `CR-L2`
- State: `HITL_REQUIRED`

### Loop CR-002

- Loop ID: `CR-L2`
- Connected Change Item: `CR-002`
- Target: Update operational notes in `MEMORY.md`
- Input materials: Confirmed next step or explicit instruction to keep placeholders unresolved
- Act: Replace placeholder operational notes only if they can be made factual
- Observe: Confirm that execution notes remain accurate and preserved
- Reason: `CONTENT`
- Verifier: File inspection
- Completion criteria: No unexplained placeholder notes remain, or they are explicitly marked pending
- Retry policy: Maximum 3 retries per content issue
- Stop conditions: Need to preserve records, missing facts, or conflict with previous deployment history
- HITL conditions: No confirmed follow-up step or factual replacement exists
- Expected files: `MEMORY.md`
- Predecessor: `CR-L1`
- Next loop: none
- State: `HITL_REQUIRED`
