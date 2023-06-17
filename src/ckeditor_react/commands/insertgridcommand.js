import Command from '@ckeditor/ckeditor5-core/src/command';

export class InsertRowCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
            const selection = this.editor.model.document.selection;
        	var rowElement = writer.createElement( 'row');
        	var columnElement1 = writer.createElement( 'column');
        	var columnElement2 = writer.createElement( 'column');
        	writer.appendElement( 'paragraph', columnElement1, {style: 'margin-bottom:0px'} );
        	writer.appendElement( 'paragraph', columnElement2, {style: 'margin-bottom:0px'} );
        	writer.append(columnElement1, rowElement);
        	writer.append(columnElement2, rowElement);
        	var container = findParent(selection.getFirstPosition(), (item)=>this.editor.model.schema.checkChild(item, 'row'));
        	if(container){
        		writer.append(rowElement, container);
        	}
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        var container = findParent(selection.getFirstPosition(), (item)=>this.editor.model.schema.checkChild(item, 'row'));
        this.isEnabled = container !== null;
    }
}


export class InsertColCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
        	const selection = this.editor.model.document.selection;
        	const Row = findParent( selection.getFirstPosition(), (element)=>element.name=='row');
        	if(!Row) return;
        	var columnElement = writer.createElement( 'column');
        	writer.appendElement( 'paragraph', columnElement, {style: 'margin-bottom:0px'});
        	writer.append(columnElement, Row)
            
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const Row = findParent( selection.getFirstPosition(), (element)=>element.name=='row');
        this.isEnabled = Row !== null;
    }
}

export class InsertBoxCommand extends Command {
	execute() {
		this.editor.model.change( writer => {
			// Insert <simpleBox>*</simpleBox> at the current selection position
			// in a way that will result in creating a valid model structure.
			const selection = this.editor.model.document.selection;
			var container = findParent(selection.getFirstPosition(), (item)=>this.editor.model.schema.checkChild(item, 'box'));
			if(!container) return;
			var boxElement = writer.createElement( 'box');
			writer.appendElement( 'paragraph', boxElement, {style: 'margin-bottom:0px'});
			writer.append(boxElement, container)
			
		} );
	}
	
	refresh() {
		const model = this.editor.model;
        const selection = model.document.selection;
        var container = findParent(selection.getFirstPosition(), (item)=>this.editor.model.schema.checkChild(item, 'box'));
        this.isEnabled = container !== null;
	}
}
