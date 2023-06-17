/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ReactView from '../ui/reactview';
import React from 'react'
import FormatComp from './ui/FormatComp';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class CopyFormat extends Plugin {
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
		return 'CopyFormat';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		const editor = this.editor;
		const t = this.editor.t;
		
		
		editor.ui.componentFactory.add( 'cpformatButton', locale => {
            
            var ui = new ReactView(locale, <FormatComp ref={ui=>this.FormatUI = ui} 
            	onClick={(attrs, name)=>{this._setAttributes(attrs, name)}}
            	onDoubleClick={()=>{this._getAttributes()}}>
            </FormatComp>);
            
            return ui;
            
        } );
		
		this.exceptAttrs = ['link', 'src', 'srcset', 'url', 'linkHref', 'id'];
		
	}
	
	
	_getAttributes(){
		var selection = this.editor.model.document.selection;
		var srcElement = selection.getSelectedElement();
		if(!srcElement) srcElement = selection.getFirstPosition().textNode;
		if(!srcElement) srcElement = selection.getFirstPosition().parent;
		if(srcElement.name == '$root') return;

		var name = srcElement.name;
		if(!name){
			name = Object.getPrototypeOf(srcElement).constructor.name
		}
		
		var attributesIterable = srcElement.getAttributes();
		var attributes = Array.from(attributesIterable);
		
		if(!name) name = '';
		if(!attributes) attributes = [];

		var validAttributes = [];
		attributes.map(item => {
			if(this.exceptAttrs.includes(item[0])) return;
			validAttributes.push(item);
		})

		this.FormatUI.setValue({
			element: name,
			attributes: validAttributes,
		})
		
	}
	
	_setAttributes(attrs, name){
		
		var selection = this.editor.model.document.selection;
		var desElement = selection.getSelectedElement();
		if(!desElement) desElement = selection.getFirstPosition().parent;	
		if(desElement.name == '$root') return;
		
		var applyElement = [];
		
		if(name == 'Text'){
			var children = desElement.getChildren();
			for(let child of children){
				if(Object.getPrototypeOf(child).constructor.name == 'Text'){
					applyElement.push(child);
				}
			}
		}else{
			applyElement.push(desElement);
		}


		
		this.editor.model.change(writer=>{

			for(let child of applyElement){
				
				var attributesIterable = child.getAttributes();
				for (let attr of attributesIterable){
					if(this.exceptAttrs.includes(attr[0])) continue;
					writer.removeAttribute(attr[0], child);
				}
				
				var attributes = {};
				for (let attr of attrs){
					if(this.exceptAttrs.includes(attr)) continue;
					if(!this.editor.model.schema.checkAttribute( child, attr[0] )) continue;
					attributes[attr[0]] = attr[1];
				}
				writer.setAttributes(attributes, child);
			}
		});
	}
	
	
	
}



