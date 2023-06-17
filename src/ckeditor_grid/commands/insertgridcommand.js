import Command from '@ckeditor/ckeditor5-core/src/command';

export class InsertRowCommand extends Command {
    execute() {
        this.editor.model.change( writer => {
            // Insert <simpleBox>*</simpleBox> at the current selection position
            // in a way that will result in creating a valid model structure.
			const selection = this.editor.model.document.selection;

			var mousePosition = selection.getSelectedElement();
			if(!mousePosition) mousePosition = selection.getFirstPosition().parent;
			

        	var rowElement = writer.createElement( 'row');
        	var columnElement1 = writer.createElement( 'column');
        	var columnElement2 = writer.createElement( 'column');
        	writer.appendElement( 'paragraph', columnElement1);
        	writer.appendElement( 'paragraph', columnElement2);
        	writer.append(columnElement1, rowElement);
        	writer.append(columnElement2, rowElement);
        	var container = findParent(selection.getFirstPosition(), (item)=>this.editor.model.schema.checkChild(item, 'row'));
        	if(container){
		
				if(mousePosition.parent.name == container.name){
					writer.insert(rowElement, writer.createPositionBefore(mousePosition));
					if(mousePosition.name == 'paragraph' && mousePosition.childCount == 0){
						writer.remove(mousePosition);
					}
				}else{
					writer.append(rowElement, container);
				}
				
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
        	writer.appendElement( 'paragraph', columnElement);
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

			var mousePosition = selection.getSelectedElement();
			if(!mousePosition) mousePosition = selection.getFirstPosition().parent;

			var boxElement = writer.createElement('box');
			writer.appendElement( 'paragraph', boxElement);

			if(mousePosition.parent.name == container.name){
				writer.insert(boxElement, writer.createPositionBefore(mousePosition));
				if(mousePosition.name == 'paragraph' && mousePosition.childCount == 0){
					writer.remove(mousePosition);
				}
			}else{
				writer.append(boxElement, container);
			}
			
			

		} );
	}
	
	refresh() {
		const model = this.editor.model;
        const selection = model.document.selection;
        var container = findParent(selection.getFirstPosition(), (item)=>this.editor.model.schema.checkChild(item, 'box'));
        this.isEnabled = container !== null;
	}
}
