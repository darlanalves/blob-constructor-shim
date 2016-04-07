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

    var originalBlob = window.Blob;
    var proto = originalBlob.prototype;

    function Blob(parts, properties) {
        properties = properties || {};

        var blob = createBlob(parts, properties.type || '');
        blob.slice = proto.slice || proto.mozSlice || proto.webkitSlice || sliceError;

        return blob;
    }

    Blob.prototype = Object.create(proto);
    Blob.prototype.constructor = Blob;

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
