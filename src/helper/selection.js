import Position from '@ckeditor/ckeditor5-engine/src/model/position';
import Range from '@ckeditor/ckeditor5-engine/src/model/range';

export function getSelectElement(selection, condition = null) {
    var validElement = [];

    try {
        var start = selection.getFirstPosition();
        var end = selection.getLastPosition();
        
        if(start.parent.name != '$root') start = Position._createBefore(start.parent);
        if(end.parent.name != '$root') end = Position._createAfter(end.parent);

        var range = new Range(start, end);
        if (!range) return validElement;

        var checkRange = null
        for (const item of range.getItems()) {
            if (checkRange != null && checkRange.containsItem(item)) continue;
            checkRange = new Range(Position._createBefore(item), Position._createAfter(item));
            if (condition) { if (!condition(item)) continue; }
            validElement.push(item)
        }

    } catch (error) {
        console.log(error);
    }

    return validElement;
}