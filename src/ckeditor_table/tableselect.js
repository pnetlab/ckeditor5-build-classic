/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MouseUpObserver from '@ckeditor/ckeditor5-engine/src/view/observer/mouseupobserver';




/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class TableSelect extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'TableSelect';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
	
		
		this._registerSchema();
		this._registerConverters();
		
		const editor = this.editor;
		
		editor.selectTable= null;
		editor.selectCells = {};
		editor.selectTbFlag = false;
		
		editor.selectView = ()=>{
			editor.editing.view.change( writer => {
				var listCells = findChildren(editor.editing.view.document.getRoot(), (item)=>(item.name == 'td' || item.name == 'th'));
				for (let i in listCells){
					writer.removeClass( 'cell_selected', listCells[i] );
				}
				
				for (let i in editor.selectCells){
					var cellElement = editor.editing.mapper.toViewElement(editor.selectCells[i]);
					if(!cellElement) continue;
					writer.addClass( 'cell_selected', cellElement );
				}
			});
			
		}
		
		editor.editing.view.addObserver(MouseUpObserver);
		editor.editing.view.document.on('mouseup', (event, dom)=>{
			editor.selectTbFlag = false;
			editor.selectCells = {};
			editor.selectView();
			editor.selectTable = null;
			
		})
		
		
		
		

		
	}

	/**
	 * @private
	 */
	_registerSchema() {
		this.editor.model.schema.extend( 'table', {
			allowAttributes: ['selecting', 'selected', 'select_event', 'select_old']
		});
		
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	_registerConverters() {
		const editor = this.editor;
		
//		editor.conversion.for( 'editingDowncast' ).add( downcastDispatcher => downcastDispatcher.on( 'attribute:select_event:table', ( evt, data, conversionApi ) => {
//			
//			var table = data.item;
//			var selected = get(table.getAttribute('selected'), {});
//			var select_old = get(table.getAttribute('select_old'), selected);
//			
//			editor.model.change(writer=>{
//				writer.setAttribute('select_old', selected, table)
//			})
//			
//			for( let i in select_old){
//				var cell = select_old[i];
//				var cellView = conversionApi.mapper.toViewElement(cell);
//				if(!cellView) continue;
//				conversionApi.writer.removeClass('cell_selected', cellView);
//			}
//			
//			
//			for( let i in selected){
//				var cell = selected[i];
//				var cellView = conversionApi.mapper.toViewElement(cell);
//				conversionApi.writer.addClass('cell_selected', cellView);
//			}
//			
//		}, { priority: 'low' } ));
		
		
	}
	
	
	
	
}



/**
 * The available options are `'px'` or `'%'`.
 *
 * Determines size unit applied to resized table.
 *
 * ```js
 * ClassicEditor
 * 	.create( editorElement, {
 * 		 table: {
 * 			 resizeUnit: 'px'
 * 		 }
 * 	 } )
 * 	.then( ... ) 
 * 	.catch( ... );
 * ```
 *
 * This option is used by the {@link module:table/TableResize~TableResize} feature.
 *
 * @default '%'
 * @member {String} module:table/table~tableConfig#resizeUnit
 */
