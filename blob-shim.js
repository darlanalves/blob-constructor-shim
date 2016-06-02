/**
 * Cross-browser Blob constructor
 *
 * Replaces the Blob constructor on window with a custom constructor that uses
 * the BlobBuilder instead. BlobBuilder is deprecated and will only be used if
 * Blob constructiob is not supported
 */

function checkBlobConstructor() {
    try {
        return new Blob(['{}'], { type: 'application/json' });
    } catch (e) {
        applyShim();
    }
}

function applyShim() {
    console.log('Using Blob shim');

    function Blob(parts, properties) {
        properties = properties || {};

        var blob = createBlob(parts, properties.type || '');
        Object.assign(this, blob);
    }

    var originalBlob = window.Blob;
    var proto = Object.create(originalBlob.prototype);

    proto.constructor = Blob;
    proto.slice = proto.slice || proto.mozSlice || proto.webkitSlice || sliceError;

    Blob.prototype = proto;

    window.Blob = Blob;
}

function createBlob(parts, type) {
    var BlobBuilder = window.BlobBuilder ||
        window.MSBlobBuilder ||
        window.MozBlobBuilder ||
        window.WebKitBlobBuilder;

    var builder = new BlobBuilder();

    for (var i = 0; i < parts.length; i += 1) {
        builder.append(parts[i]);
    }

    return builder.getBlob(type);
}

function sliceError () {
    throw new Error('Blob.slice not supported in this browser');
}

checkBlobConstructor();
