## Cross-browser Blob constructor

Replaces the Blob constructor on `window` with a custom constructor that uses
the BlobBuilder instead. BlobBuilder is deprecated and will only be used if
Blob constructiob is not supported

It also normalizes the `.slice` method, found behind prefixes in some older browsers.

Note: I don't know what effects it may cause on other APIs, e.g. FileAPI

## Why?

On updated versions of all browser the `Blob` constructor is already supported. However,
older versions of this spec are still in place, for example on PhantomJS engine used
on unit testing