# ShareCount App

This is a web application that allows users to count the number of shares for a given URL on various social media platforms.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Main features](#mainfeatures)

## Installation

To install the ShareCount app, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/lightsrh/ShareCount.git
    ```

2. Install the dependencies:
    ```bash
    cd ShareCount
    npm install
    ```

## Usage

To use the ShareCount app, follow these steps:

1. Start the application:
    ```bash
    ./setup.sh
    ```
    This will start the docker images for the database and the rest of the application

## Main features

### Login page

On this page you can create an account and log in into the application. 

### Home page

This page display all the groups you are a part of. You can click on a group to have more informations about it. On the top right corner is a menu button. Various opitons are available, you can log out, create a group and join a group. For the last one you need a token given to you by another member of the group.

### Group page

When you click on a group you go to its reserved page. On the left all the expenses are listed, with the title, the informations about the expense, the amount, the date and the users concerned by it.
On the center cards display all the users and the money you owe to them / they owe you. If you are at balance only the name of the user is displayed. 
FInally on the right a graphic display all the money you owe and need to get back
