
# Task Management System

## Introduction
This project is a Task Management System designed to help users manage their tasks efficiently. It provides functionalities to create, update, delete, and view tasks.

## Features
- User Authentication
- Task Creation
- Task Update
- Task Deletion
- Task Viewing
- Task Filtering and Sorting

## Working Flow

### 1. User Authentication
Users need to register and log in to access the task management features. Authentication ensures that each user's data is secure and private.

### 2. Task Creation
Once authenticated, users can create new tasks. Each task requires a title, description, due date, and priority level.

### 3. Task Update
Users can update the details of their tasks. This includes changing the title, description, due date, and priority level.

### 4. Task Deletion
Users can delete tasks that are no longer needed. This helps in keeping the task list clean and relevant.

### 5. Task Viewing
Users can view all their tasks in a list format. Each task displays its title, description, due date, and priority level.

### 6. Task Filtering and Sorting
Users can filter tasks based on their status (e.g., completed, pending) and sort them by due date or priority level.

## Technologies Used
- Frontend: HTML, CSS, JavaScript, React
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)

## Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/task_management_system.git
    ```
2. Navigate to the project directory:
    ```bash
    cd task_management_system
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
        ```
        DATABASE_URL=your database url
        JWT_SECRET=your_jwt_secret
        ```
5. Start the development server:
    ```bash
    npm start
    ```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.
