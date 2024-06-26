#### Low Prio To Do:

- create logic on how to become admin
- create gui for uploading files if admin
- display a success msg if registration is successful, display err otherwise
- send schema validation errs to reg page
- using exports for toastr configs

#### Setup

```bash
npm init -y && npm install && npm start
```

#### File Tree

```bash
.
├── admin
│   └── uploadStorage.js
├── app.js
├── controllers
│   ├── auth.js
│   ├── files.js
│   └── pages.js
├── db
│   ├── connect.js
│   └── gridFS.js
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
│   │   ├── mstile-150x150.png
│   │   ├── safari-pinned-tab.svg
│   │   └── site.webmanifest
│   ├── images
│   │   ├── logo.png
│   │   ├── school.png
│   │   └── statue.png
│   └── js
│       ├── account.js
│       ├── login.js
│       └── register.js
├── README.md
├── routes
│   ├── auth.js
│   ├── files.js
│   └── pages.js
└── views
    ├── 404.ejs
    ├── about.ejs
    ├── account.ejs
    ├── article.ejs
    ├── home.ejs
    ├── index.ejs
    ├── login.ejs
    └── partials
        ├── footer.ejs
        ├── head.ejs
        ├── header.ejs
        └── nav.ejs
```
