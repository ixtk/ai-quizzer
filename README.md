# AI-Quizzer

multiplayer ქვიზ-პლატფორმა რომელიც იყენებს ხელოვნულ ინტელექტს.

## ფუნქციები
- ოთახის შექმნა ან შერჩევა 6-ნიშნა კოდით
- რეალურ დროში ლობის სტატუსი: მოთამაშეები, host, readines.
- Firebase ავტორიზაცია
- MongoDB-ს გამოყენება ოთახების და მომხმარებლების შესანახად
- ხელოვნური ინტელექტის მეშვეობით ქვიზების შექმნა

## გამოყენებული ტექნოლოგიები

### Frontend
- **React 19**
- **React Router**
- **Vite** – build & development server
- **Socket.io-client** – რეალურ დროში კომუნიკაცია
- **Firebase Authentication**
- **Axios** – HTTP მოთხოვნები
- **Formik** & **Yup** – ფორმების მართვა და ვალიდაცია
- **Lucide-react** – აიკონები
- **clsx** – დინამიური კლასების მართვა

### Backend
- **Node.js**
- **Express.js**
- **Socket.io** – სოკეტ ლოგიკა
- **MongoDB** & **Mongoose**
- **Firebase Admin SDK** – სერვერზე იუზერის ვალიდაცია
- **nanoid** – ოთახის კოდის გენერაცია
- **dotenv** – გარემოს ცვლადები
- **cors** – CORS პოლიტიკის მხარდაჭერა

### Dev Tools
- **nodemon** – backend-ის ავტომატური გადატვირთვა
- **ESLint** & React Hooks Plugin
- **@vitejs/plugin-react**
