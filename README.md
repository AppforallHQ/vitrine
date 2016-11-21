

Development
===========

Getting started
---------------

    $ gem install foreman
    $ npm install
    $ npm install -g nodemon

An example tmuxinator window would be like

    - vitrine:
        pre:
          - cd vitrine
        layout: main-horizontal
        panes:
          -
          - PORT=8007 foreman run nodemon boot.js

Category Translations
---------------------

  See `lib/category_translations.js`


Deployment
==========

By now you should've installed
*   `orch`
on the production server.

Dependencies
------------

All these were installed in previous steps:

    foreman
    nodejs
    redis-server (see "initial setup" below)
    mongodb
    git-deploy on local machine

> *TODO:*
> each of our apps should declare the necessary
> dependencies inside itself, even if other apps
> take care of installing them.

Deploy
------

*   Add a remote to your local git clone
        git remote add host user@host.FQDN:/app/vitrine

*   Initiate remote git remote and deploy hooks on the remote server

        git deploy setup -r host

*   Push to remote
    > **NOTE**
    > Unlike `orch`, we use a production branch to store
    > production-specific configs (the `.env` file)
    > (This isn't exactly a best-practice)
    >
    > Those configs include
    > * path to mongodb mock server for development
    >
    > **Please checkout to `production` branch first.**
    >
    > Also save and commit your local changes before pushing things.

        git checkout production
        git merge master

    and then

        git push host production:master
        git checkout master

*   Do the "initial setup". `ssh` to remote server and run

        ssh user@host.FQDN
        sudo apt-get install redis-server
        npm config set strict-ssl false
        cd /app/vitrine
        deploy/before_restart
        ./export_procfile
        sudo service vitrine start

If the app was not listening on port 8007, run `deploy/restart`
manually on the remote server to debug.

### Configuration ###

 - change system configuration in "lib/{website-configs.js,cache-configs.js,logs-configs.js} (FIXME: use .env file)
