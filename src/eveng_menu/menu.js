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
import MenuFactory from './menuFactory'

import ReactView from '../ui/reactview';
import React from 'react'
import MenuComp from './ui/MenuComp';
/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class menu extends Plugin {
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
		return 'menu';
	}

	/**
	 * @inheritDoc
	 */
	init() {

		const editor = this.editor;
		const t = this.editor.t;

		this._registerConverters();

		editor.ui.componentFactory.add('menuButton', locale => {

			var ui = new ReactView(locale, <MenuComp
				onClick={() => { this._menuCtrl() }}>
			</MenuComp>);

			return ui;

		});

		MenuFactory(editor, 'paragraph');
		MenuFactory(editor, 'listItem');

		editor.commands.add('removeMenu', (menu_id)=>{
			var childrent = findChildren(editor.model.document.getRoot(), (child)=>child.getAttribute('menu_id')==menu_id);
			this.editor.model.change(writer => {
				childrent.map(child=>{
					writer.removeAttribute('menu_id', child);
				})
			})
			this.editor.editing.view.focus();
			
		})

	}

	_menuCtrl() {
		var values = makeId();
		var range = this.editor.model.document.selection.getFirstRange();
		var selected = '';
		for (const item of range.getItems()) {
			selected += item.data;
		}
		if(selected==''){
			Swal('', 'Please select text for create menu', 'warning');
			return;
		}

		var menuable = this._getMenuable();
		if (menuable) {
			this._setmenu(menuable, values);
			var menuCfg = this.editor.config.get('menu');
			if (isset(menuCfg['onCreate'])) {
				menuCfg['onCreate'](values, selected);
			}
		}
		this.editor.editing.view.focus();

	}

	_getMenuable() {
		var selection = this.editor.model.document.selection;
		var selectionElement = selection.getSelectedElement();
		if (selectionElement) {
			if (this.editor.model.schema.checkAttribute(selectionElement, 'menu_id')) {
				return selectionElement;
			}
		}

		return findParent(selection.getFirstPosition(), (element) => { return this.editor.model.schema.checkAttribute(element, 'menu_id') });

	}

	_setmenu(menuableElement, values) {
		this.editor.model.change(writer => {
			writer.setAttribute('menu_id', values, menuableElement);
		})
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	_registerConverters() {
		const editor = this.editor;

		// editor.conversion.for('upcast')
		// 	.attributeToAttribute({ model: 'menu_id', view: 'menu_id' });
		editor.conversion.attributeToAttribute({ model: 'menu_id', view: 'menu_id' });
	}



}



