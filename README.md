#### Low Prio To Do:

- display a success msg if registration is successful, display err otherwise
- using exports for toastr configs

#### Setup

```bash
npm install && npm start
```

#### Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

#### Routers

- auth.js
- pages.js

#### User Model

Email Validation Regex Or email-validator library

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

#### Register User

- Validate - name, email, studentNumber, yearAndSection, and password, - with Mongoose
- Hash Password (with bcryptjs)
- Save User
- Generate Token
- Send Response with Token

#### Login User

- Validate - email, password - in controller
- If email or password is missing, throw BadRequestError
- Find User
- Compare Passwords
- If no user or password does not match, throw UnauthenticatedError
- If correct, generate Token
- Send Response with Token

#### Mongoose Errors

- Validation Errors
- Duplicate (Email)
- Cast Error

#### Security

- helmet
- cors
- xss-clean
- express-rate-limit

Swagger UI

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: the job id
```

#### File Tree

```bash
.
├── app.js
├── controllers
│   ├── auth.js
│   └── pages.js
├── db
│   └── connect.js
├── errors
│   ├── bad-request.js
│   ├── custom-api.js
│   ├── index.js
│   ├── not-found.js
│   └── unauthenticated.js
├── eslint.config.mjs
├── middlewares
│   ├── authentication.js
│   ├── error-handler.js
│   └── not-found.js
├── models
│   └── User.js
├── package.json
├── public
│   ├── css
│   │   └── style.css
│   ├── favicon
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── browserconfig.xml
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   ├── favicon_package_v0.16.zip
│   │   ├── mstile-150x150.png
│   │   ├── safari-pinned-tab.svg
│   │   └── site.webmanifest
│   ├── images
│   │   ├── logo.png
│   │   ├── school.png
│   │   └── statue.png
│   └── js
│       ├── confusedAF.js
│       ├── libraryBundle.js
│       ├── login.js
│       └── register.js
├── README.md
├── routes
│   ├── auth.js
│   └── pages.js
└── views
    ├── 404.ejs
    ├── about.ejs
    ├── database.ejs
    ├── home.ejs
    ├── index.ejs
    ├── login.ejs
    └── partials
        ├── footer.ejs
        ├── head.ejs
        ├── header.ejs
        └── nav.ejs

```
