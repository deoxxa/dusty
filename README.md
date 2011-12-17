Dusty
=====

Overview
--------

This utility recursively compiles a directory containing dust.js templates into
either a single javascript file or a file per template. It also provides API
access to the underlying logic that makes it all tick, so it can be embedded
into express for example.

I was heavily inspired by Dan McGrady's duster.js (and originally this was just
a fork!), but quite quickly outgrew the provided functionality of his tool.

Install
-------

    npm install -g dusty

Usage
-----

    dusty --out /destination/path /path/to/dust/templates

OR

    dusty --single --out /destination/path/template.js /path/to/dust/templates

The former will compile the templates into separate files under the directory
specified in the argument to `--out` and the latter will compile them into a
single package, again specified with `--out`.
