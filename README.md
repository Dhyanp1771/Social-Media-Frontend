#  Social Media Platform – Frontend

This is the **frontend** of the Social Media Platform project, built using **React.js**, **Redux Toolkit**, and **Tailwind CSS**.  
It provides a modern, responsive, and interactive user interface for features such as user authentication, profile management, post creation, user search, and more.

## Features

###  Authentication & Authorization
- **User Registration** with form validations (username, email, password, confirm password).
- **User Login** using either **username** or **email** with password.
- **Account Activation** via email (token-based).
- **Password Reset** with email verification and new password form.
- **JWT-based Authentication** with token storage.

###  Profile Management
- View and update **profile details** (username, bio, avatar).
- **Avatar Upload** with preview and upload progress.
- Display **follower/following counts**.
- List user posts in the profile view.
- **Follow/Unfollow** users with optimistic UI.

###  Posts & Feed
- Create new posts with text and image uploads.
- View the **home feed** with all posts from followed users.
- Like and comment on posts.

### User Search & Discovery
- Search for users by name with a **debounced search bar**.
- Display **user cards** with avatar, username, and follow button.

###  UI/UX Enhancements
- Fully **responsive** design using Tailwind CSS.
- **Skeleton loaders** for better perceived performance.
- **Infinite Scroll** for posts feed.
- **Optimistic UI** for quick user interaction feedback.

##  Tech Stack

**Frontend:**
- [React.js](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MUI](https://mui.com/)
- [react-hook-form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- [react-dropzone](https://react-dropzone.js.org/)
- [react-easy-crop](https://github.com/ValeryBugakov/react-easy-crop)
- [react-icons](https://react-icons.github.io/react-icons/)

> **Note:** Socket.IO **real-time chat** is not yet implemented.


