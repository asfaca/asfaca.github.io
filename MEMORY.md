# MEMORY

Project: `asfaca/suwan-eai.github.io`

## 1. Goal

- GitHub Pages용 프로페셔널 웹사이트 완성
- 반응형 데스크톱 및 모바일 지원
- 상단 `Games` 탭 구현
- 키보드와 모바일 터치로 조작 가능한 지렁이 게임 구현
- GitHub Pages 최초 배포
- Step 1의 `[게임 추가 기능:]` 반영

## 2. Required Deliverables

- 프로젝트 루트의 `index.html`
- `styles.css`
- `script.js`
- 필요한 경우 별도 `game.js`
- 필요한 이미지 및 정적 assets
- `AORR.md`
- `MEMORY.md`

## 3. Current Scope

- 정적 HTML, CSS, JavaScript
- 프로페셔널 웹사이트 콘텐츠
- 반응형 레이아웃
- `Games` 탭
- 지렁이 게임
- GitHub Pages 배포

## 4. Out of Scope

- 백엔드 서버
- 데이터베이스
- 로그인 및 회원가입
- 결제
- 사용자 개인정보 수집
- 별도 승인 없는 외부 API
- 별도 승인 없는 프레임워크 전환

## 5. Current State

- 현재 상태: 로컬 구현 완료, 배포 승인 대기
- 완료한 루프: 요구사항 정리, `AORR.md` 작성, `MEMORY.md` 작성, 정적 셸 구현, 전체 앱 구현, 로컬 검증
- 다음 루프: [사람 확인 필요] GitHub Pages 최초 배포 승인
- 현재 Retry 횟수: 0
- 현재 오류 fingerprint: 없음
- Blocker: 없음
- 마지막 정상 상태: `DEPLOY_APPROVAL_REQUIRED`

## 6. Guardrails

- 기존 개인 콘텐츠 임의 삭제 금지
- 확인되지 않은 경력이나 프로젝트 정보 생성 금지
- 테스트 삭제 또는 완화 금지
- 토큰 출력 금지
- 토큰을 HTML, CSS, JavaScript에 저장 금지
- 토큰을 Git에 커밋 금지
- `github_token.txt` 커밋 금지
- `env_settings.txt` 커밋 금지
- 백엔드 기능 추가 금지
- 대규모 리팩토링 금지
- 테스트를 통과시키기 위한 기능 제거 금지

## 7. Acceptance Criteria

- 루트 `index.html` 존재
- 로컬 정적 서버에서 정상 로드
- CSS와 JavaScript 정상 로드
- 콘솔 오류 없음
- 모바일 및 데스크톱에서 레이아웃 정상
- `Games` 탭 정상 이동
- 지렁이 게임 정상 실행
- 키보드 조작 정상
- 모바일 터치 조작 정상
- 점수 및 재시작 정상
- GitHub Pages에서 HTTP 200 응답
- 배포된 사이트에서도 동일 기능 정상

## 8. Retry Policy

- 하나의 오류당 최대 3회
- 동일 오류 fingerprint 2회 반복 시 중지
- 한 번의 Retry에서 하나의 원인만 수정
- Retry마다 동일 Verifier 재실행

## 9. HITL Conditions

- 개인 프로필 내용 불명확
- 기존 콘텐츠 삭제 필요
- 요구사항 충돌
- GitHub 저장소 권한 부족
- GitHub Pages 설정 변경 필요
- 외부 서비스 추가 필요
- Retry 한계 도달

## 10. Tool Policy

- Codex는 작업 제어, 파일 수정, 테스트 실행 담당
- 가능하면 Claude Code CLI를 독립 Verifier로 사용
- 실제 사용한 Claude 모델명 기록
- 토큰 값은 어떠한 실행 기록에도 남기지 않음

## 11. Execution Log Template

Use this template for each loop:

- Loop ID:
- 시작 시각:
- 목표:
- 시작 상태:
- 가설:
- Act:
- 변경 파일:
- Verifier:
- 테스트 결과:
- exit code:
- 오류 fingerprint:
- Retry 횟수:
- 종료 상태:
- 다음 작업:
- 사람 확인 필요 항목:

## 12. Operational Notes

- 현재 저장소에는 `README.md`와 `AORR.md`만 존재한다.
- 현재는 `index.html`, `styles.css`, `script.js`를 추가했다.
- 게임은 DOM 기반으로 구현했고, `game.js`는 필요하지 않다.
- 로컬 서버는 Node REPL 기반으로 실행해 검증했다.
- GitHub Pages 배포는 아직 수행하지 않았다.

## 13. Execution Log

### Loop 1

- Loop ID: 1
- 시작 시각: 2026-07-14
- 목표: GitHub Pages용 정적 웹사이트의 가장 안전한 기본 구조 만들기
- 시작 상태: `READY` / `DISCOVER`
- 가설: 루트 `index.html`, `styles.css`, `script.js`로 모바일 반응형 셸과 `Games` 영역을 만들면 이후 게임 루프의 기반이 된다
- Act: 루트 HTML/CSS/JS를 최소 구조로 생성
- 변경 파일: `index.html`, `styles.css`, `script.js`
- Verifier: 파일 시스템 확인, 정적 연결 확인, 임시 로컬 서버 시도
- 테스트 결과: 파일 구조와 링크는 확인됨. 임시 로컬 서버 응답은 환경 문제로 확인 실패
- exit code: 0 for file checks, 1 for local server request
- 오류 fingerprint: `ENVIRONMENT`
- Retry 횟수: 0
- 종료 상태: `ACTING` completed, verification blocked by environment
- 다음 작업: [사람 확인 필요] 로컬 정적 서버 수단 확정 후 브라우저 검증
- 사람 확인 필요 항목: [사람 확인 필요] 현재 환경에서 사용할 로컬 서버 명령

### Loop 2

- Loop ID: 2
- 시작 시각: 2026-07-14
- 목표: GitHub Pages에서 실제로 사용할 수 있는 정적 개인 프로페셔널 웹사이트 완성
- 시작 상태: `ACTING`
- 가설: DOM 기반 게임 보드와 반응형 레이아웃, 접근 가능한 컨트롤, 상태 기록을 한 번에 붙이면 프로덕션 배포 전 요구사항을 충족할 수 있다
- Act: 프로페셔널 섹션, 반응형 내비게이션, DOM 기반 지렁이 게임, 점수/최고점수, 키보드/터치/스와이프 입력, 상태 데이터 속성, 접근성 보강
- 변경 파일: `index.html`, `styles.css`, `script.js`
- Verifier: 파일 존재 확인, HTML 링크 확인, 브라우저 DOM 스냅샷, 콘솔 로그, 반응형 viewport 375/768/1440, 키보드 입력, 터치 버튼 입력, 점수 증가, 벽 충돌, 재시작, 내부 링크 점검
- 테스트 결과: 통과
- exit code: 0
- 오류 fingerprint: 없음
- Retry 횟수: 0
- 종료 상태: `DEPLOY_APPROVAL_REQUIRED`
- 다음 작업: [사람 확인 필요] GitHub Pages 최초 배포 승인
- 사람 확인 필요 항목: [사람 확인 필요] GitHub Pages 배포 승인
