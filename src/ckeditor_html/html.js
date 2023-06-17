/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import magicWidgetRegister from '../ckeditor_magicwidget/widgetRegister';
import MagicWidgetFactory from '../ckeditor_magicwidget/widgetFactory';

import React, { Component } from 'react';
import ReactView from '../ui/reactview';
import HtmlComp from './ui/HtmlComp';
import {render} from 'react-dom';
import HtmlEditorModal from './ui/HtmlEditorModal'
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class html extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'html';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;
		var bladeCfg = editor.config.get('blade');
		if(!bladeCfg) bladeCfg = {};

		this._registerSchema();
		this._registerConverters();

		magicWidgetRegister(this.editor, 'html');

		editor.ui.componentFactory.add('htmlButton', locale => {

			const dropdownView = createDropdown(locale);

			// Decorate dropdown's button.
			dropdownView.buttonView.set({
				label: t('HTML'),
				tooltip: true,
				withText: true,
				class: 'ck-button__label__fit',

			});

			var ui = new ReactView(locale, <HtmlComp ref={comp=>this.htmlComp = comp} onClick={(data) => {
				this.editor.model.change(writer => {
					const selection = this.editor.model.document.selection;
					var container = findParent(selection.getFirstPosition(), (item) => this.editor.model.schema.checkChild(item, 'html'));
					if (!container) return;

					var mousePosition = selection.getSelectedElement();
					if(!mousePosition) mousePosition = selection.getFirstPosition().parent;

					var htmlElement = writer.createElement('html', {name:data.name, id:data.id, classname: data.classname});

					if(mousePosition.parent.name == container.name){
						writer.insert(htmlElement, writer.createPositionBefore(mousePosition));
						if(mousePosition.name == 'paragraph' && mousePosition.childCount == 0){
							writer.remove(mousePosition);
						}
					}else{
						writer.append(htmlElement, container);
					}

				})
			}}></HtmlComp>);

			dropdownView.panelView.children.add(ui);
			return dropdownView;

		});



		this.editor.editing.view.document.on('keydown', (event, dom) => {
			var evt = dom.domEvent;
			if (evt.code == 'ArrowRight') {
				var selectElement = editor.model.document.selection.getSelectedElement();
				if (!selectElement) return;
				if (selectElement.name != 'html') return;

				if(selectElement.parent.getChildIndex(selectElement) < selectElement.parent.childCount - 1) return;
				
				this.editor.model.change(writer => {
					var start = writer.createPositionAfter(selectElement);
					writer.insertElement( 'paragraph', start);
				});
			}
		}, { priority: 100000 });


		var reactLoader = document.createElement('div');
		document.body.append(reactLoader);
		render(<HtmlEditorModal ref={comp => this.editModal = comp}></HtmlEditorModal>, reactLoader);

	}

	_registerSchema() {

		this.editor.model.schema.register('html', {
			allowWhere: '$block',
			allowAttributes: ['name', 'id', 'classname','content'],
			defaults:{height:50, hunit:'px'},
			isObject: true,
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate table's attribute to the img tag.
		editor.conversion.for('editingDowncast').elementToElement({
			model: 'html',
			view: (modelElement, viewWriter) => {

				var content = modelElement.getAttribute('content');
				if(!content) content = '';
				var name = modelElement.getAttribute('name');
				if(!name) name = '';
				var classname = modelElement.getAttribute('classname');
				if(!classname) classname = '';
				var id = modelElement.getAttribute('id');
				if(!id) id = '';

				var bladeElement = viewWriter.createContainerElement('div', {class:'html_item'}, [], {
						click: (ve, de, ev) => {
							var model = this.editor.editing.mapper.toModelElement(ve);
							this.editor.model.change(writer => {
								var range = writer.createRangeOn(model);
								writer.setSelection(range);
							})
							
						},
						dblclick: (ve, de, ev)=>{
							var model = this.editor.editing.mapper.toModelElement(ve);

							var content = model.getAttribute('content');
							if(!content) content = '';
							var id = model.getAttribute('id');
							if(!id) id = '';
							var classname = model.getAttribute('classname');
							if(!classname) classname = '';
							var name = model.getAttribute('name');
							if(!name) name = '';
							
							this.editModal.modal();
							this.editModal.setValue({name, id, classname, content});
							this.editModal.setOnSave((data)=>{
								var model = this.editor.editing.mapper.toModelElement(ve);
								this.editModal.modal('hide');
								this.editor.model.change(writer => {
									writer.setAttributes(data, model);
								})
							})
							
						}
	
					});

				viewWriter.insert(viewWriter.createPositionAt(bladeElement, 0), viewWriter.createUIElement('div', {}, (domDocument)=>{
					var div = document.createElement(name);
					div.className = `html_content ${classname}`;
					div.style['pointer-events'] = 'none';
					div.id = id;
					div.innerHTML = content;
					return div;
				}));

				var widgetFactory = new MagicWidgetFactory(this.editor);
				bladeElement = widgetFactory.make(viewWriter, modelElement, bladeElement, { 
					resize: 'both', 
					color: '#2196F3', 
					editable: false,
					
				});

				return bladeElement;
			}
		}).add( dispatcher =>
			dispatcher.on( 'attribute:content:html', ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				var newContent = data.attributeNewValue;
				if(!newContent) newContent = '';

				var domElement = this.editor.editing.view.domConverter.mapViewToDom(viewElement);
				if(!domElement) return;
				domElement = domElement.getElementsByClassName('html_content');
				if(domElement[0]){
					domElement[0].innerHTML = newContent;
				}
			}), {priority:'low'}
		).add( dispatcher =>
			dispatcher.on( 'attribute:id:html', ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				var newContent = data.attributeNewValue;
				if(!newContent) newContent = '';

				var domElement = this.editor.editing.view.domConverter.mapViewToDom(viewElement);
				if(!domElement) return;
				domElement = domElement.getElementsByClassName('html_content');
				if(domElement[0]){
					domElement[0].id = newContent;
				}
			}) , {priority:'low'}
		).add( dispatcher =>
			dispatcher.on( 'attribute:classname:html', ( evt, data, conversionApi ) => {
				
				const viewWriter = conversionApi.writer;
				const viewElement = conversionApi.mapper.toViewElement( data.item );
				var newContent = data.attributeNewValue;
				if(!newContent) newContent = '';

				var oldData = data.attributeOldValue;
				if(!oldData) oldData = '';
				
				var domElement = this.editor.editing.view.domConverter.mapViewToDom(viewElement);
				if(!domElement) return;
				domElement = domElement.getElementsByClassName('html_content');
				if(domElement[0]){
					if(oldData != '') domElement[0].classList.remove(oldData);
					if(newContent != '') domElement[0].classList.add(newContent);
				}
			}), {priority:'low'}
		);


		editor.conversion.for('dataDowncast').elementToElement({
			model: 'html',
			view: (modelElement, viewWriter) => {

				var content = modelElement.getAttribute('content');
				if(!content) content = '';
				var name = modelElement.getAttribute('name');
				if(!name) name = '';
				var classname = modelElement.getAttribute('classname');
				if(!classname) classname = '';
				var id = modelElement.getAttribute('id');
				if(!id) id = '';

				// var bladeElement = viewWriter.createEmptyElement('div', {class:'html_item'});

				// viewWriter.insert(viewWriter.createPositionAt(bladeElement, 0), viewWriter.createUIElement('div', {}, (domDocument)=>{
				// 	var div = document.createElement(name);
				// 	div.className = `html_content ${classname}`;
				// 	div.id = id;
				// 	div.innerHTML = content;
				// 	return div;
				// }));

				var bladeElement = viewWriter.createUIElement('div',{class:'html_item'}, (domDocument)=>{
					var div = bladeElement.toDomElement(domDocument);
					var contentDom = document.createElement(name);
					contentDom.className = `html_content ${classname}`;
					contentDom.id = id;
					contentDom.innerHTML = content;
					div.appendChild(contentDom)
					return div;
				});

				return bladeElement;
			}
		});

		editor.data.upcastDispatcher.on('element:div', (evt, data, conversionApi) => {
			const { consumable, schema, writer } = conversionApi;
			if(!data.viewItem.hasClass('html_item')) return;

			consumable.consume(data.viewItem, { name: true });
			
			var htmlContent = findChildren(data.viewItem, (item) => item.hasClass('html_content'));
			

			if (!htmlContent || !htmlContent[0]) return;
			htmlContent = htmlContent[0];

			consumable.consume(htmlContent, { name: true });

			var domElement = this.editor.editing.view.domConverter.viewToDom(htmlContent, document);
			if(!domElement) return;
			var name = domElement.tagName;
			if(!name) name = 'div';
			var content = domElement.innerHTML;
			if(!content) content = '';
			var id = domElement.id;
			if(!id) id = '';
			var classname= domElement.className.replace('html_content', '').trim();
			if(!classname) classname = '';

			var modelElement = writer.createElement('html', {id, content, classname, name});
			// Find allowed parent for element that we are going to insert.
			// If current parent does not allow to insert element but one of the ancestors does
			// then split nodes to allowed parent.
			const splitResult = conversionApi.splitToAllowedParent(modelElement, data.modelCursor);

			// When there is no split result it means that we can't insert element to model tree, so let's skip it.
			if (!splitResult) {
				return;
			}

			// Insert element on allowed position.
			
			writer.insert(modelElement, splitResult.position);

			const parts = conversionApi.getSplitParts(modelElement);
			const lastSplitPart = parts[ parts.length - 1 ];
			 
			data.modelRange = new ModelRange(
				conversionApi.writer.createPositionBefore(modelElement),
				conversionApi.writer.createPositionAfter(lastSplitPart)
			);
			data.modelCursor = conversionApi.writer.createPositionAfter( lastSplitPart );

		});

	}

}



