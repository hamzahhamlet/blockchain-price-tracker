[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## How to start the project

```bash
$ yarn install
$ yarn docker:up
```

The backend will start on PORT 3000 and the database will run on port 5432

The env file is commited so that it's easier to build the project.
Altough you would need to set the Moralis API Key in the env file.

Also kindly add the gmail configuration for the nodemailer to be running

```bash
$ MORALIS_API_KEY=""
$ MAIL_USERNAME=""
$ EMAIL_PASSWORD=""
```
