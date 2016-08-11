# NPM Modules

## Overview
This document will cover some basic steps to get setup using git and node modules. You'll be working primarily on the command line. If this is new to you, sorry about the additional cognitive load, but I'd recommend diving in instead of looking for GUI alternatives (Confucius say: Those who seek GUI alternatives meet sticky ends). Feel free to ask on the #js-arch Slack channel if you need help with anything.

## Setup
On your mac, uninstall any version of node you currently have installed, and instead use [nvm (Node Version Manager)](https://github.com/creationix/nvm). Instructions are on the GitHub page. Then use it to install a recent version of node, such as the 6.2.0 branch (`nvm install v6.2.0; nvm use 6.2.0`).

Using a virtual machine (vagrant), I don't recommend using nvm. Instead, install node at the version you want during your provisioning step using the steps outlined at [https://github.com/nodesource/distributions](https://github.com/nodesource/distributions).

## Create a Module
1. Create a new empty GitHub repo `my-module` (calling it something other than my-module).
2. On your local filesystem `mkdir my-module && cd my-module && touch README.md.`
3. `git init && git add . && git commit -m "initial commit"`
4. `git remote add origin https://github.com/spoonflower/my-module && git remote -v && git push -u origin master`.
4. Create and commit a `.gitignore` file with something like
```
node_modules/
.vagrant/
.env
.DS_Store
```

Run `npm init`. This will walk you through a wizard on the command line to set up your `package.json` file. When prompted to enter an entry point, enter `todo.js`. You can use defaults for the rest of the items if you'd like, or edit them as you see fit.

One thing that I like to do that helps prevent you from accidentally publishing your package on npm is to add `"private": true` to the json. 

## Exploring Node Modules
Now that you've got a new repo setup, let's play around with npm a little bit. We're going to make a toy todo library. We'll just make the data handling component for now, which will work in node or the browser. Remember, although node is known for running as a server, it's perfectly adequate at doing scripting or running tests. We'll write in ES5 to keep things easily compatible with the browser.

### Installing Third Party Modules
To generate unique ids for our todos, let's get a uuid module installed. Most open source modules are published in the npm library. If you haven't used an npm module before, it's good practice to check out its GitHub page, so we can have a look at it's package.json file, and also to see when it was last updated to make sure it has some activity. 

Visit [https://github.com/defunctzombie/node-uuid](https://github.com/defunctzombie/node-uuid) and open the package.json file. It's a good idea to check out the dependencies section. When you're thinking about the browser, and maintainence in general, extra dependencies can add weight and make upgrading down the road more difficult, so it's important to just be cognizant of what you're getting into by installing the library. A uuid library is simple enough to not need dependencies, and you'll see that it does in fact contain no "dependencies" entry. If you'd like to contrast with a more complicated module, look at the package.json for the [Express Framework](https://github.com/expressjs/express/blob/master/package.json)

Another place to check is the `"name"` key. This will be what you use to install the module. We can see that the name for the node-uuid module is 'uuid'. In your `my-module` folder, type in `npm install --save uuid`.

After the installation is complete, in your editor or file browser, open up the `node_modules/uuid` folder. You should see pretty much the same files as the GitHub page.

Also, reload your local package.json, and check the `"dependencies"` key. You should see that a new entry has been added for it, with the key name `"uuid"`. This happened because we specified the `--save` argument for the install command, which updates your local package.json automatically. If you are installing a package just for development use, such as a test suite, you can use `--save-dev` to put the entry in the `"devDependencies"` key. This will mark the module as being unnecessary for production installs.

You've just installed an external module. In node, there are also internal modules, that use the same system, but live locally within your module. To specify you are requiring an external module, don't use an absolute or relative path when requiring. `require('uuid')` loads the uuid module from your `node_modules` folder. `require('./lib/uuid')` looks for `./lib/uuid.js`, relative to the path of the script it's called in. We'll explore this more in a bit.

### Folder Structure & Import/Export
For external modules, you can specify the name of the file you'd like to use as the primary entry point using the `"main"` key in package.json. Look at the uuid package for an example. You'll see it refers to 'uuid.js'. This means that after you have installed this module, when you do something like `var foo = require('uuid')`, `foo` will refer to whatever is 'exported' by the `uuid.js` file. Open up the `uuid.js` file in GitHub and see if you can predict what properties `foo` would have in the above example (hint, it's at the bottom).

In this case, it may be a little confusing if you aren't aware that functions are also objects in js. We see that the variable `uuid` is assigned to the function `v4`. It then has properties assigned to other functions, such as `v1`, `v4`, `parse`, and `unparse`. Finally, the `uuid` var is exported in the node fashion, by using `module.exports = uuid`.

Create a new file called `todo.js`, and put the following in it.

```js
var uuid = require('uuid');
console.log('v4', uuid.v4());
console.log('v1', uuid.v1());
```

Now let's run it using node and see what we get. Enter `node todo.js` in your console, and you should get output that looks like

```
v4 2330c912-8cf6-430e-bd7b-4c61879e81ea
v1 8e1e1480-5e41-11e6-8d3d-ffcfb964ea53
```

Next, let's create an internal module. 

1. Run `mkdir lib && echo "module.exports = 'Hello!';" > lib/hello.js`.
2. Add `console.log('Hello?', require('./lib/hello'))` to your `todo.js` file and save.
3. Run `node todo.js` again. You should see `Hello? Hello!` added to the output.

Hopefully this also helps demonstrate that you can export any type of variable in `module.exports`. Whatever you export is what will be pulled in when you do a `require`.

## Todo Data API
Let's go ahead and complete our Todo API, and push it to git.

Read and copy over `todo-api/todo.js`, and `todo-api/lib/crud.js` to your local repo. As far as architecture goes, don't read too much into the structure. The code is simple enough that I probably wouldn't break it into an internal module in a real world situation. Rather, it's to demonstrate that you can use internal modules, while exporting the package as a whole. Also, make sure the `"name"` key in the package.json file is `todo-api`. Push these changes to your private git repo.

## Todo Web
Next, we'll be setting up an application designed to be compiled for the browser, that uses the todo-api module we've just committed to git.

Create a new folder and npm module named todo-web, using `npm init`. You can skip creating a github repo for it this time around.

### Setting GitHub Up with SSH
We need a way to point your package.json file at private GitHub modules. What this boils down to is ensuring that git knows how to connect to the repository over ssh, authenticating itself with a private ssh key.

Follow the guide at [https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to get your ssh key setup.

The syntax to use that hints to npm that it wants something to be installed over ssh and git is: 

```js
"dependencies": {
  "my-module": "git+ssh://git@github.com/my-user-or-org/my-module"
}
```

Add this to your package.json file in todo-web. You can then run `npm install` to test (`npm install` by itself will do it's best to install any missing dependencies specified in your package.json).

If you are having trouble with this, you can set an environment variable to help git send the correct ssh key. It looks like `export GIT_SSH_COMMAND='ssh -i ~/.ssh/github.pem'` where github.pem is the private key you set up with GitHub.

### Setup webpack
`npm install --save-dev webpack`

Make a place for the compiled file to live. `mkdir -p public/js`

Create the entry point for the browser application. `echo "console.log('hello, browser');" > browser.js`

Create your webpack config file called `webpack.config.js`. These can start out very simple, read and copy `todo-web/webpack.config.js`. The key names for this minimal example should be self-explanatory.

Create `public/index.html`. This will load your compiled `bundle.js` file. Read and copy over the example file `todo-web/public/index.html`.

Run webpack with the command `./node_modules/webpack/bin/webpack.js`. It will automatically find your config file. If you'd like to explicitely point to a config file, you can use `./node_modules/webpack/bin/webpack.js --config webpack.config.js`.

If you open up the public/index.html file in your browser, you should get a message logged to the console.

### Adding an npm build script
Because it's cumbersome to type in the webpack build commands, I find it very useful to add scripts to npm. This is a nice way to add build commands without bringing in something cumbersome like gulp until you're sure you need it.

Add build commands under the `"scripts"` key in package.json.

```js
"scripts": {
  "build-dev-js": "./node_modules/webpack/bin/webpack.js",
  "build-prod-js": "./node_modules/webpack/bin/webpack.js --optimize-minimize --optimize-dedupe"
}
```

And then run with `npm run build-dev-js` or `npm run build-prod-js`.

### Using todo-api from todo-web
We've already set up and installed the todo-api package, so let's go ahead and use it. Read the `todo-web/browser.js` file, and play with making similar changes with your own. When you make a change, remember to compile it using `npm run build-dev-js` and reload your browser.

### Summary
There is plenty more that these technologies can accomplish, but this guide has hopefully given you a nice grasp of the basic functionality. 

When learning a new way of doing something you've already done at a professional level before, a very common thing that pops into your head are questions along the lines of "but how does this new way handle situation *X* that I used to handle a different way?". Please don't be shy about asking these questions in #js-arch on Slack, or to me in person.

Finally, the todo app that we created is ripe for a simple uni-directional architecture to be put in place. If you'd like, we can focus on that aspect next.
