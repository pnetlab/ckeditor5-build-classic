/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import ReactView from '../ui/reactview';
import React, { Component } from 'react';
import BladeComp from './ui/BladeComp'
import background from '../ckeditor_background/background';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class blade extends Plugin {
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
		return 'blade';
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
		this._registerConverters(bladeCfg);

		editor.ui.componentFactory.add('bladeButton', locale => {

			const dropdownView = createDropdown(locale);

			// Decorate dropdown's button.
			dropdownView.buttonView.set({
				label: t('Blade'),
				tooltip: true,
				withText: true,
				class: 'ck-button__label__fit',

			});

			var ui = new ReactView(locale, <BladeComp ref={blade=>this.bladeComp = blade} onClick={(blade) => {
				this.editor.model.change(writer => {
					const selection = this.editor.model.document.selection;
					var container = findParent(selection.getFirstPosition(), (item) => this.editor.model.schema.checkChild(item, 'blade'));
					if (!container) return;

					var mousePosition = selection.getSelectedElement();
					if(!mousePosition) mousePosition = selection.getFirstPosition().parent;

					var bladeElement = writer.createElement('blade', {name: blade});
					
					if(mousePosition.parent.name == container.name){
						writer.insert(bladeElement, writer.createPositionBefore(mousePosition));
						if(mousePosition.name == 'paragraph' && mousePosition.childCount == 0){
							writer.remove(mousePosition);
						}
					}else{
						writer.append(bladeElement, container);
					}
				})
			}}></BladeComp>);

			dropdownView.panelView.children.add(ui);

			
			dropdownView.buttonView.on('execute', () => {
				
				if(bladeCfg.getBlade) bladeCfg.getBlade().then(data=>{
					if(!data) data = [];
					this.bladeComp.setBlades(data);
				});
				
			})

			return dropdownView;

		});


		this.editor.editing.view.document.on('keydown', (event, dom) => {
			var evt = dom.domEvent;
			if (evt.code == 'ArrowRight') {
				var selectElement = editor.model.document.selection.getSelectedElement();
				if (!selectElement) return;
				if (selectElement.name != 'blade') return;

				if(selectElement.parent.getChildIndex(selectElement) < selectElement.parent.childCount - 1) return;
				
				this.editor.model.change(writer => {
					var start = writer.createPositionAfter(selectElement);
					writer.insertElement( 'paragraph', start);
				});
			}
		}, { priority: 100000 });



	}

	_registerSchema() {

		this.editor.model.schema.register('blade', {
			allowWhere: '$block',
			allowAttributes: ['name', 'variables'],
			isObject: true,
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	_registerConverters(bladeCfg) {
		const editor = this.editor;

		// Dedicated converter to propagate table's attribute to the img tag.
		editor.conversion.for('editingDowncast').elementToElement({
			model: 'blade',
			view: (modelElement, viewWriter) => {
				var bladeName = modelElement.getAttribute('name');
				var variables = modelElement.getAttribute('variables');
				if(!variables) variables = '';

				var bladeElement = viewWriter.createContainerElement('blade', {
						style:`display: block;
						color: red;
						width: 100%;
						cursor: pointer;
						border: dashed thin darkred;
						text-align: center;
						border-radius: 5px;`, 
						contenteditable: false, 
						name:bladeName,
						variables: variables,
					}, [], {
					click: (ve, de, ev) => {
						var model = this.editor.editing.mapper.toModelElement(ve);
						this.editor.model.change(writer => {
							var range = writer.createRangeOn(model);
							writer.setSelection(range);
						})
						
					},
					dblclick: (ve, de, ev)=>{
						var model = this.editor.editing.mapper.toModelElement(ve);
						var nameBlade = model.getAttribute('name');
						var variables = model.getAttribute('variables');
						if(bladeCfg.onEditBlade) bladeCfg.onEditBlade(nameBlade, variables, (config)=>{
							this.editor.model.change(writer => {
								writer.setAttribute('variables', config, model)
							})
						})
					}

				});

				viewWriter.insert(viewWriter.createPositionAt(bladeElement, 0), viewWriter.createUIElement('span', {name:bladeName}, function(domDocument){
					const domElement = this.toDomElement( domDocument );
					domElement.innerHTML = `<span>${this.getAttribute('name')}</span>`;
					return domElement;
				}));

				return bladeElement;
			}
		}).attributeToAttribute( {
			model: 'variables',
			view: 'variables'
		});
		


		editor.conversion.for('dataDowncast').elementToElement({
			model: 'blade',
			view: (modelElement, viewWriter) => {
				var bladeName = modelElement.getAttribute('name');
				var variables = modelElement.getAttribute('variables');
				if(!variables) variables = '';

				var bladeElement = viewWriter.createEmptyElement('blade', {
						name:bladeName,
						variables: variables,
				});

				return bladeElement;
			}
		})

		

		editor.conversion.for('upcast').elementToElement({
			view: {
				name: 'blade',
			},
			model: (viewElement, modelWriter) => {
				var name =  viewElement.getAttribute('name');
				if(!name) name = '';
				var variables = viewElement.getAttribute('variables');
				if(!variables) variables = '';
				return modelWriter.createElement('blade', {name,variables});
			}
		});

	}

}



