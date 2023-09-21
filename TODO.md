## To Do

- Finish readme publish and tweet
- Test types when passing individual versions
- Consider overloading with ability to pass function instead of version which finds "version" in data. Consider making data => data.version the default. (If the version is stored outside of the root of the object, and you started your app without that version, being wherever it ought to be..., then you can 'migrate' all day long but data will be continuously overwritten because the version itself was never there. This forces the user to, in effect, do the same thing that this library is trying to do, i.e. check and make sure something exists and is up to date. I think it's possible we should require there to be a version on the object itself that's passed in to each migration.)
