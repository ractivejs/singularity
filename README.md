# ractive-plugins

All the Ractive plugins in one place for easy discoverability and maintenance. [Babel convinced me it's a good idea.](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)

**work in progress**


## Building plugins

```bash
# build all plugins
node scripts/build.js

# build specific plugins
node scripts/build.js plugins/ractive-transitions-fade plugins/ractive-transitions-slide
```


## TODO

Lots:

* Convince everyone this is a sensible idea
* Add all existing plugins ('official' and third party)
* Automated README generation
* plugins.ractivejs.org (with an automatically generated page for each plugin, with demo)
* Consistent testing strategy (at present, most plugins lack tests)
* CI integration (i.e. plugins.ractivejs.org rebuilds on each push to master)
