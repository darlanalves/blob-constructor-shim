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
    const originalBlob = window.Blob;
    const proto = originalBlob.prototype;

    function Blob(parts, properties = {}) {
        return useBlobBuilder(parts, properties.type || '');
    }

    Blob.prototype = Object.create(proto);
    Blob.prototype.constructor = Blob;
    Blob.prototype.slice = proto.slice || proto.mozSlice || proto.webkitSlice || sliceError;

    window.Blob = Blob;
}


function useBlobBuilder(parts, type) {
    const BlobBuilder = window.BlobBuilder ||
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
