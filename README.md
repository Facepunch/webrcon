# webrcon

Game server Rcon, using websockets.

This website is accessible [here](http://facepunch.github.io/webrcon/).

##Source Code

The source code for the site is on the [gh-pages branch](https://github.com/Facepunch/webrcon/tree/gh-pages). 

The code is purposely made to work purely in the browser - with no server backend, and on as many devices as possible. It is meant to serve as an example of how to communicate with websocket rcon, but should be fully functional.

##Features

###Connection Memory

Website stores your connections. It remembers your passwords and will display a list of possible connections. Or you can just bookmark.

This information is never stored remotely, it's always stored in your browser.

###Server URLs

URLs contain the ip and port of the server you're talking to. You can copy and paste these urls to a friend - who will be prompted to enter the password. If they've already connected to the server before it will show just like a regular webpage without any password prompting.

This way you can link a friend directly to a certain page in the rcon. For example, if you wanted to show them a certain user's information.

##Rust

If you're running a Rust server you need to add "+rcon.web 1" to the command line to enable web based Rcon. If you don't define a port it will use the default port, but you will also need to set a password, which you can do with "+rcon.password password".

This will eventually be the default rcon mode. At that point you'll need to use another command to enable the old Rcon. Even more eventually, the old Rcon will be removed - so if you're a tool maker or otherwise, it would be advisable to have a way to talk to web rcon as soon as possible.

