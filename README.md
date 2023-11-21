# <img src="https://cdn.iconscout.com/icon/free/png-512/free-react-1-282599.png?f=avif&w=512" width="30"/> Todo Web App

## English

### 🔗 Links

- Github URL: [Click here](https://github.com/tripkmin/todo)
- Live Site URL: [Click here](https://todo-tripkmin.vercel.app/)

### 🛠️ Technologies Used

- `React JS`
- `TypeScript`
- `Styled-Components`
- `HTML5`, `CSS`
- `Framer Motion`

### 🗒️ Core Features

- Adding new to-do items
- Toggling completion status of existing to-dos
- Filtering to-dos
- Theme switching
- Drag and drop functionality
- Responsive web design

### ⚡ Additional Features

- When deleting a to-do, a toast is displayed with an "undo" option
  - If multiple items are deleted simultaneously with "Clear Complete," undoing will restore multiple items simultaneously
  - Undo is possible for previously deleted items while the toast timer is active
- Variable textarea style
  - Expands dynamically up to 4 lines, then becomes fixed at 4 lines and includes a custom scrollbar
- Keyboard considerations
  - Pressing Esc while editing a to-do exits the editing mode
  - Pressing Enter when adding a to-do immediately submits it
  - Pressing Shift + Enter when adding a to-do creates a line break
  - All elements can be accessed via the tab key
- Smooth theme switching
  - Transition of the background with a gradient does not work, so opacity transition of pseudo-elements is used to resolve it
  - The header image is handled in the same way

### ‼️ To-Do Features to Improve

- Issue with touch drag-and-drop not working on mobile devices.

## 한국어

### 🔗 링크

- Github URL: [여기를 클릭해주세요](https://github.com/tripkmin/todo)
- Live Site URL: [여기를 클릭해주세요](https://todo-tripkmin.vercel.app/)

### 🛠️ 사용한 기술

- `React JS`
- `TypeScript`
- `Styled-Components`
- `HTML5`, `CSS`
- `Framer Motion`

### 🗒️ 기본 기능

- 새로운 할 일 추가 기능
- 기존 할 일의 완료/미완료 토글 기능
- 할 일 필터링 기능
- 테마 전환 기능
- 드래그 앤 드롭 기능
- 반응형 웹

### ⚡ 추가 기능

- 할 일 삭제시, 하단에 undo 기능을 실행할 수 있는 toast 출력
  - Clear Complete로 다수 항목을 동시에 삭제한 경우 undo시 다수 항목이 동시에 복원됨
  - Toast 타이머가 작동되는 동안에는 그 전에 삭제했던 요소들도 undo 가능
- 가변 textarea style 기능
  - 4행까지는 가변적으로 늘어나고, 그 이상부터는 4행으로 고정됨.
  - Textarea 전용 scrollbar
- 키보드 고려
  - 할 일을 수정하다가 Esc를 누를 경우 수정이 종료됨
  - 할 일을 추가할 때 Enter를 누르면 바로 submit이 되도록 함
  - 할 일을 추가할 때 Shift + Enter를 누를 시 줄바꿈이 되도록 함.
  - 모든 요소를 탭으로 접근할 수 있도록 함.
- 부드러운 테마 전환 기능
  - gradient를 가진 background의 transition이 작동하지 않아 가상 요소의 opacity transition으로 해결
  - Header의 이미지 역시 동일한 방법으로 해결

### ‼️ 보완해야 할 기능

- 모바일 디바이스에서 터치 드래그 앤 드롭이 동작하지 않는 문제.
