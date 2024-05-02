# ShareCount App

This is a web application that allows users to count the number of shares for a given URL on various social media platforms.
Please see the TAD for more explanations about the architecture of this project, and informations about this project (French version available).

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Main features](#mainfeatures)
- [Stopping the app](#stop)

## Prerequisites

You need to have python3, NodeJs and docker installed.
You must place yourself in a python virtual environment with psycopg2 installed.


## Installation

To install the ShareCount app, follow these steps:

1. Clone the repository:
    ``` bash
    git clone https://github.com/lightsrh/ShareCount.git
    ```

2. Install the dependencies:
    ``` bash
    cd ShareCount
    npm install
    ```

## Usage

To use the ShareCount app, follow these steps:

1. Build the docker images
    ``` bash
    docker compose build
    ```

    You can then choose to launch the app in deploy or developpment mode

2. Start the application in deploy mode:
    ``` bash
    ./setup.sh
    ```
    This will start the docker images for the database and the rest of the application

2. Start the application in developpment mode:
    ``` bash
    docker compose up db
    python3 setup_db.py
    nodemon app.js
    ```
    You need the nodemon package installed for this.
    If you don't have it
    ``` bash
    npm install nodemon
    ```

3. Launch the Web Browser :

    To launch the app you can go to this address in your favorite web browser
    ``` bash
    http://localhost:8080
    ```

## Main features

### Login page

On this page you can create an account and log in into the application. 

### Create account page

This page allows you to create an account to connect on ShareCount.

### Home page

This page display all the groups you are a part of. You can click on a group to have more informations about it. On the top right corner is a menu button. Various opitons are available, you can log out, create a group and join a group. For the last one you need a token given to you by another member of the group.

### Group page

When you click on a group you go to its reserved page. On the left all the expenses are listed, with the title, the informations about the expense, the amount, the date and the users concerned by it.
On the center cards display all the users and the money you owe to them / they owe you. If you are at balance only the name of the user is displayed. 
Finally on the right a graphic display all the money you owe and need to get back.

If you are part of a group with only one member you need to add at least one more before creating your first expense.

### Create group page

One this page you can create a new group for yourself and your friends. 

### Create expense page

While on this page you can create a new expense for the group you are in. You need to add the title of the expense, the person who made the expense, and who it is for, the date (in the past), the amount and more informations if needed.

### How to join a group

While in a group you can copy the access token and give it to someone. This token allows you to join a group.

Some groups are already existing you can join them with the tokens below :

```
qsmp
dapper
sunny
```
The tokens you will generate yourself will be uuid4 generated. This are example to allow you to test the app with fake groups


## Stopping the app

To stop the app you have to destroy the docker images you have created. In the terminal write the following commands : 

``` bash
docker compose down
docker image rm sharecount-app:latest postgres:latest 
```
