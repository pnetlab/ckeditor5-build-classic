/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Template from '@ckeditor/ckeditor5-ui/src/template';
import View from '@ckeditor/ckeditor5-ui/src/view';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';
import SizeCtrl from './ui/SizeCtrl'
import React, { Component } from 'react'
import ReactView from '../ui/reactview';

/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */

export default class MagicWidgetFactory {

	constructor(editor) {
		this.editor = editor;
	}

	make(viewWriter, modelElement, viewElement, options = {}) {
		this.options = options;
		this.init(modelElement, viewElement);

		modelElement['magicwidget_factory'] = this;

		viewWriter.addClass('editing', viewElement);
		if(!options.editable){
			viewWriter.setAttribute('contenteditable',false,viewElement);
		}else{
			viewWriter.setAttribute('contenteditable',true,viewElement);
		}
		

		//		viewWriter.setStyle({
		//			position:'relative',
		//		}, viewElement)

		viewWriter.setAttribute('key', Date.now() + '' + Math.floor(Math.random() * 1000000), viewElement);

		var elementEvents = { ...viewElement.events };

		viewElement.events = Object.assign(viewElement.events, {
			click: (ve, de, evt) => {

				evt.stopPropagation();
				this.editor['magicwidget_selected'] = {};
				this._showSelectWidget();
				this._hideAllBalloon();
				if (typeof (elementEvents.click) == 'function') elementEvents.click(ve, de, evt);
			},

			// dblclick: (ve, de, evt) => {
			// 	evt.stopPropagation();
			// 	this.editor.model.change(writer => {
			// 		var me = this.editor.editing.mapper.toModelElement(ve);

			// 		if (this.editor.model.schema.checkChild(me, 'paragraph')) {
			// 			var paragraph = writer.createElement('paragraph', { style: 'margin-bottom:0px' });
			// 			writer.insert(paragraph, writer.createPositionAt(me, me.childCount));
			// 			writer.setSelection(paragraph, 'in');
			// 		}
			// 	});

			// 	if (typeof (elementEvents.dblclick) == 'function') elementEvents.dblclick(ve, de, evt);
			// },

			dragstart: (ve, de, event) => { event.stopPropagation(); this.editor['magicwidget_draged'] = ve },
			drop: (ve, de, event) => { event.stopPropagation(); this._drop(ve, de, event) },
			dragover: (ve, de, event) => { event.stopPropagation(); event.preventDefault(); this._dragOver(ve, de, event) },
			dragenter: (ve, de, event) => { event.stopPropagation() },
			dragleave: (ve, de, event) => { event.stopPropagation(); this._dragLeave(ve, de, event) },

		});


		if (isset(this.options['resize'])) {
			viewWriter.addClass('resize', viewElement);
			viewWriter.setStyle('resize', 'both', viewElement);
			viewElement.events.mousedown = (ve, de, ev)=>{
				
				if(this.editor.widgetResizing) return;
				
				var offsetBt = de.clientHeight - ev.offsetY;
				var offsetRi = de.clientWidth - ev.offsetX;
				
				if (offsetBt >= 0 && offsetBt <= 20 && offsetRi >= 0 && offsetRi <= 20) {
					
					if (typeof (elementEvents.mousedown) == 'function') elementEvents.mousedown(ve, de, ev);
					this.editor.widgetResizing = {ve, de, options:this.options};

					var parent = ve.parent;
					if (parent.name == 'td') {
						this.editor.editing.view.change(writer => {
							writer.setStyle('width', de.parentNode.clientWidth + 'px', parent)
						})
					}
				}
			}

		}

		const eagleLeft = viewWriter.createEmptyElement('div', { class: 'magicwidget_eagle left', title: modelElement.name, style: 'border-color:' + get(this.options.color, '') }, { click: (ve, de, ev) => { this._selectWidget(ve.parent, de, ev) } });
		viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleLeft);

		const eagleRight = viewWriter.createEmptyElement('div', { class: 'magicwidget_eagle right', title: modelElement.name, style: 'border-color:' + get(this.options.color, '') }, { click: (ve, de, ev) => { this._selectWidget(ve.parent, de, ev) } });
		viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleRight);

		const eagleTop = viewWriter.createEmptyElement('div', { class: 'magicwidget_eagle top', title: modelElement.name, style: 'border-color:' + get(this.options.color, '') }, { click: (ve, de, ev) => { this._selectWidget(ve.parent, de, ev) } });
		viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleTop);

		const eagleBottom = viewWriter.createEmptyElement('div', { class: 'magicwidget_eagle bottom', title: modelElement.name, style: 'border-color:' + get(this.options.color, '') }, { click: (ve, de, ev) => { this._selectWidget(ve.parent, de, ev) } });
		viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), eagleBottom);

		this.editor.editing.mapper.bindElements(modelElement, viewElement);

		return viewElement;

	}

	init(modelElement, viewElement) {

		const editor = this.editor;
		const t = this.editor.t;

		this.balloonPanel = new BalloonPanelView(this.editor.locale);

		var toolBar = new ReactView(this.editor.locale, <div style={{ display: 'flex', padding: 3, alignItems: 'center', position: 'relative' }}>
			
			
				<div title="Clean" onClick={() => this.freeSize()} style={{ fontWeight: 'bold', margin: 0, cursor: 'pointer', }}>{modelElement.name.toUpperCase()}</div>

				{isset(this.options['resize']) ? <>
					&nbsp;<div style={{ borderLeft: 'solid thin darkgray', top: 0, bottom: 0, alignSelf: 'stretch' }}></div>&nbsp;
						<SizeCtrl ref={sizeCtrl => this.widthCtrl = sizeCtrl} label="Width" units={['px', '%']} onChange={(width, wunit) => { this._resize(width, wunit) }} />
					&nbsp;<div style={{ borderLeft: 'solid thin darkgray', top: 0, bottom: 0, alignSelf: 'stretch' }}></div>&nbsp;
						<SizeCtrl ref={sizeCtrl => this.heightCtrl = sizeCtrl} label="Height" units={['px', '%']} onChange={(height, hunit) => { this._resize(null, null, height, hunit) }} />
				</>
					: ''}

				{this.options.toolbar != null ? this.options.toolbar : ''}
			
		</div>
		)

		var close = new ReactView (this.editor.locale, <div title="Close" onClick={() => this._hideAllBalloon()} style={{cursor:'pointer', fontSize:'18px', fontWeight:'bold', lineHeight:'18px', padding:7, color:'gray'}}>&times;</div>

)


		var balloonTool = new View(this.editor.locale);

		balloonTool.setTemplate({
			tag: 'div',
			attributes: {
				style: {
					display: 'flex'
				}
			},

			children: [toolBar, ...get(this.options['buttons'], []), close]
		})

		// Add a child view to the panel's content collection.
		this.balloonPanel.content.add(balloonTool);
		editor.ui.view.body.add(this.balloonPanel);
		//editor.ui.focusTracker.add( this.balloonPanel.element );

		this.editor['magicwidget_balloon'][this.balloonPanel.viewUid] = this.balloonPanel;

		var widgetDocumentClick = (event, dom) => {
			event.stop();
			this.editor['magicwidget_selected'] = {};
			this._hideAllBalloon();
		}
		this.editor.editing.view.document.on('click', widgetDocumentClick);

		this.balloonPanel.viewElement = viewElement;
		this.balloonPanel.clickCallback = widgetDocumentClick;

	}




	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */

	freeSize() {
		if (this.widthCtrl) this.widthCtrl.setValue('', 'px');
		if (this.heightCtrl) this.heightCtrl.setValue('', 'px');
		this._resize('', 'px', '', 'px');
	}

	_resize(width, wunit, height, hunit, ve, me) {

		if (!ve || !me) {
			if (!this.editor['magicwidget_selected']) return;
			me = Object.values(this.editor['magicwidget_selected'])[0];
			ve = this.editor.editing.mapper.toViewElement(me);
			if (!ve || !me) return;
		}

		this.editor.model.change(writer => {

			var attrs = {};
			if (isset(width) && isset(wunit)) {
				attrs['width'] = width;
				attrs['wunit'] = wunit;
			}
			if (isset(height) && isset(hunit)) {
				attrs['height'] = height;
				attrs['hunit'] = hunit;
			}
			writer.setAttributes(attrs, me);
		});

		if (typeof (ve.events.resize) == 'function') ve.events.resize(width, wunit, height, hunit);
	}

	_drop(ve, de, event) {

		var dropModel = this.editor.editing.mapper.toModelElement(ve);
		if (!dropModel) return;
		if (!this.editor['magicwidget_draged']) return;
		var dragModel = this.editor.editing.mapper.toModelElement(this.editor['magicwidget_draged']);
		if (!dragModel) return;

		this.editor.editing.view.change(writer => {
			writer.removeClass('dragover', ve);
		})

		if (dragModel.name != dropModel.name && this.editor.model.schema.checkChild(dropModel, dragModel)) {
			this.editor.model.change(writer => {
				writer.append(dragModel, dropModel)
			});
		} else {
			this.editor.model.change(writer => {
				var position = writer.createPositionAfter(dropModel);
				try {
					writer.insert(dragModel, position);
				} catch (e) {
					return;
				}

			});
		}

	}

	_dragOver(ve, de, event) {
		if (typeof (allowWidgetOverEvent) == 'undefined' || !allowWidgetOverEvent) {
			global.allowWidgetOverEvent = true;
			setTimeout(() => { global.allowWidgetOverEvent = false }, 1000);
			this.editor.editing.view.change(writer => {
				writer.addClass('dragover', ve);
			})
		}
	}

	_dragLeave(ve, de, event) {
		this.editor.editing.view.change(writer => {
			writer.removeClass('dragover', ve);
		})
	}

	_selectWidget(ve, de, evt) {
		evt.stopPropagation();

		this.editor['magicwidget_selected'] = {};
		var widget = this.editor.editing.mapper.toModelElement(ve);

		this.editor.model.change(writer => {
			var start = writer.createPositionBefore(widget);
			var end = writer.createPositionAfter(widget);
			var range = writer.createRange(start, end);
			writer.setSelection(range);
		});

		this.editor['magicwidget_selected'][ve.parent.getAttribute('key')] = widget;

		this._showSelectWidget();
		this._hideAllBalloon();

		const positions = BalloonPanelView.defaultPositions;

		this.balloonPanel.pin({
			target: get(de, this.editor.editing.view.domConverter.mapViewToDom(ve)),
			positions: [
				positions.northArrowSouth,
				positions.southArrowNorth
			]
		});

		if (this.widthCtrl) this.widthCtrl.setValue(widget.getAttribute('width'), widget.getAttribute('wunit'));
		if (this.heightCtrl) this.heightCtrl.setValue(widget.getAttribute('height'), widget.getAttribute('hunit'));

		if (isset(this.options.onSelect)) {
			this.options.onSelect(widget, ve);
		}

	}

	_showSelectWidget() {

		this.editor.editing.view.change(writer => {
			var widgets = findChildren(this.editor.editing.view.document.getRoot(), (element) => { return element.hasClass('magic_widget', 'editing', 'selected') });
			for (let i in widgets) {
				writer.removeClass('selected', widgets[i]);
			}

			for (let i in this.editor['magicwidget_selected']) {
				var widget = this.editor['magicwidget_selected'][i];
				if (widget) {
					var widgetView = this.editor.editing.mapper.toViewElement(widget);
					if (widgetView) {
						writer.addClass('selected', widgetView);
					}
				}
			}
		})
	}

	_hideAllBalloon() {
		var balloons = this.editor['magicwidget_balloon'];
		if (!balloons || balloons.length == 0) return;
		for (let i in balloons) {
			try {
				balloons[i].unpin();
				if (!this.editor.editing.mapper.toModelElement(balloons[i].viewElement)) {
					this.editor.ui.view.body.remove(balloons[i]);
					this.editor.editing.view.document.off('click', balloons[i].clickCallback);
					delete (this.editor['magicwidget_balloon'][i]);
				}
			} catch (e) {
				console.log(e);
			}
		}


	}



}





