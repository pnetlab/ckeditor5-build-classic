/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module table/TableResize
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import MouseUpObserver from '@ckeditor/ckeditor5-engine/src/view/observer/mouseupobserver';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import { findAncestor } from '@ckeditor/ckeditor5-table/src/commands/utils';
import SetCellColorCommand from '@ckeditor/ckeditor5-table/src/commands/setcellcolorcommand';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import BalloonPanelView from '@ckeditor/ckeditor5-ui/src/panel/balloon/balloonpanelview';

import SizeCtrl from './ui/SizeCtrl'
import ToolBar from './ui/toolbarview'

import React, { Component } from 'react'
import { render } from 'react-dom'

/**
 * The table resize plugin.
 *
 * It adds a possibility to resize each table using handles.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MagicWidget extends Plugin {
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
		return 'MagicWidget'; 
	}

	/**
	 * @inheritDoc
	 */
	init() {
		
		const editor = this.editor;
		const t = this.editor.t;
		
		this._registerSchema();
		this._registerConverters();
		
		editor.ui.componentFactory.add( 'testWidget', locale => {
			
			const widgetButtonView = new ButtonView( locale );
			widgetButtonView.set( {
                label: t( 'Row' ),
                withText: true,
                tooltip: true
            } );
			
            this.listenTo( widgetButtonView, 'execute', () => {
            	this.editor.model.change( writer => {
                    // Insert <simpleBox>*</simpleBox> at the current selection position
                    // in a way that will result in creating a valid model structure.
        			
                	var magic_widget = writer.createElement( 'magic_widget', {width:'100', height:'15', wunit:'%', hunit:'px'} );
                	writer.appendElement( 'paragraph', magic_widget, {style: 'margin-bottom:0px'} );
                    this.editor.model.insertContent(magic_widget);
                } );
            } );

			return widgetButtonView; 
		})
		
		
		this.balloonPanel = new BalloonPanelView( this.editor.locale );
		
		var toolBar = new ToolBar(this.editor.locale, [])
		toolBar.render();
		
		render(<div style={{display: 'flex', padding:3}}>
					<SizeCtrl ref={sizeCtrl => this.widthCtrl = sizeCtrl} label="Width" units={['px', '%']} onChange={(width, wunit)=>{this._resize(width, wunit)}}/>
					&nbsp;<div style={{borderLeft:'solid thin darkgray'}}></div>&nbsp;
					<SizeCtrl ref={sizeCtrl => this.heightCtrl = sizeCtrl} label="Height" units={['px', '%']} onChange={(height, hunit)=>{this._resize(null, null, height, hunit)}}/>
				</div>, toolBar.element);
		
		// Add a child view to the panel's content collection.
		this.balloonPanel.content.add( toolBar );
		editor.ui.view.body.add( this.balloonPanel );
		editor.ui.focusTracker.add( this.balloonPanel.element );
		
	}
	
	
	_registerSchema() {
		this.editor.model.schema.register( 'magic_widget', {
			allowWhere: '$block',
			isObject: true,
			isLimit: true,
			allowAttributes: ['key','width', 'height', 'wunit', 'hunit'],
			allowContentOf: '$root',
		});
	}

	/**
	 * Registers table resize converters.
	 *
	 * @private
	 */
	_registerConverters() {
		const editor = this.editor;
		
		
		this.editor.editing.view.document.on('click', ()=>{
			this.editor['magicwidget_selected']={};
			this._showSelectWidget();
			this.balloonPanel.unpin();
		})

		// Dedicated converter to propagate table's attribute to the img tag.
		editor.conversion.for( 'dataDowncast' ).elementToElement( {
		    model: 'magic_widget',
		    view: ( modelElement, viewWriter ) => {
		       return viewWriter.createContainerElement( 'div', {class: 'magic_widget', style:`
		                width: ${modelElement.getAttribute('width') + modelElement.getAttribute('wunit')};
		                height: ${modelElement.getAttribute('height') + modelElement.getAttribute('hunit')};
                	`})
		    }
		} );
		
		editor.conversion.for( 'upcast' ).elementToElement( {
		    view: {
		        name: 'div',
		        classes: 'magic_widget'
		    },
		    model: ( viewElement, modelWriter ) => {
		    	var widthStyle = /(\d+)(\D+)/.exec(viewElement.getStyle( 'width' ));
		    	var heightStyle = /(\d+)(\D+)/.exec(viewElement.getStyle( 'height' ));
		    	
		    	if(!widthStyle) widthStyle = [];
		    	if(!heightStyle) widthStyle = [];
		    	
		        return modelWriter.createElement( 'magic_widget', { 
		        	width: get(widthStyle[1],''), 
		        	height: get(heightStyle[1],''), 
		        	wunit: get(widthStyle[2],''),
		        	hunit: get(heightStyle[2],''), 
		        } );
		    }
		} );
		
		editor.conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'magic_widget',
            view: ( modelElement, viewWriter ) => {
            	
            	this.editor.model.change( writer => {
    				writer.setAttributes( {key: Date.now()+Math.random()}, modelElement);
                });
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createContainerElement( 'div', {draggable:"true", class: 'magic_widget editting', style:`
	                width: ${modelElement.getAttribute('width') + modelElement.getAttribute('wunit')};
	                height: ${modelElement.getAttribute('height') + modelElement.getAttribute('hunit')};
                	` }, [], {mouseup: (ve, de, ev)=>{
                		
                		var offsetBt =  de.offsetHeight - ev.offsetY;
                		var offsetRi =  de.offsetWidth - ev.offsetX;
                		if(offsetBt >=0 && offsetBt <=15 && offsetRi >=0 && offsetRi <=15){
                			var wunit = get(modelElement.getAttribute('wunit'), '%');
                			var hunit = get(modelElement.getAttribute('hunit'), 'px');
                			
                			var parentWidth = de.parentNode.clientWidth;
                			var parentHeight = de.parentNode.clientHeight;
                			
                			var width = de.clientWidth;
                			var height = de.clientHeight;
                			
                			if(wunit == '%'){
                				width = Math.ceil(width*100/parentWidth);
                				if(width > 100) width=100;
                			}
                			if(hunit == '%'){
                				height = Math.ceil(height*100/parentHeight);
                				if(height > 100) height=100;
                			}
                			var me = this.editor.editing.mapper.toModelElement(ve);
                			this._resize(width, wunit, height, hunit, ve, me);
                			
                			
                		}
                	},
                	
                	click: (ve, de, evt)=>{
                		evt.stopPropagation(); 
                		this.editor['magicwidget_selected']={}; 
                		this._showSelectWidget();
                		this.balloonPanel.unpin();
                	},
                	
//                	dblclick: (ve, de, evt)=>{
//                		evt.stopPropagation(); 
//                		this.editor.model.change( writer => {
//                			var me = this.editor.editing.mapper.toModelElement(ve);
//                			var paragraph = writer.createElement( 'paragraph', {style: 'margin-bottom:0px'});
//                			writer.append(paragraph, me);
//                			writer.setSelection( paragraph, 'in' );
//                        } );
//                	},
                	
                	dragstart: (ve, de, event)=>{event.stopPropagation(); this.editor['magicwidget_draged'] = ve},
					drop:(ve, de, event)=>{event.stopPropagation(); this._drop(ve, de, event)},
			  		dragover:(ve, de, event)=>{event.stopPropagation(); event.preventDefault(); this._dragOver(ve, de, event)},
			  		dragenter:(ve, de, event)=>{event.stopPropagation()},
				    dragleave:(ve, de, event)=>{event.stopPropagation(); this._dragLeave(ve, de, event)},
                	
                	});
                
                const eagleLeft = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle left'}, {click: (ve, de, ev)=>{this._selectWidget(ve, de, ev)}} );
                viewWriter.insert(viewWriter.createPositionAt(div, 0), eagleLeft);
                
                const eagleRight = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle right'}, {click: (ve, de, ev)=>{this._selectWidget(ve, de, ev)}});
                viewWriter.insert(viewWriter.createPositionAt(div, 0), eagleRight);
                
                const eagleTop = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle top'}, {click: (ve, de, ev)=>{this._selectWidget(ve, de, ev)}});
                viewWriter.insert(viewWriter.createPositionAt(div, 0), eagleTop);
                
                const eagleBottom = viewWriter.createEmptyElement('div', {class:'magicwidget_eagle bottom'}, {click: (ve, de, ev)=>{this._selectWidget(ve, de, ev)}});
                viewWriter.insert(viewWriter.createPositionAt(div, 0), eagleBottom);
                
                this.editor.editing.mapper.bindElements( modelElement, div)
                
                
                
                
                return div;
            }
        } );
		
		
	}
	
	
	_resize(width, wunit, height, hunit, ve, me){
		
		if(!ve || !me){
			if(!this.editor['magicwidget_selected']) return;
			me = Object.values(this.editor['magicwidget_selected'])[0];
			ve = this.editor.editing.mapper.toViewElement(me);
			if(!ve || !me) return;
		}
		
		this.editor.editing.view.change( writer => {
			var style = {};
			if(isset(width) && isset(wunit)){
				style['width'] = width + wunit;
			}
			if(isset(height) && isset(hunit)){
				style['height'] = height + hunit;
			}
			writer.setStyle( style , ve);
		});
		
		this.editor.model.change( writer => {
			
			var attrs = {};
			if(isset(width) && isset(wunit)){
				attrs['width'] = width;
				attrs['wunit'] = wunit;
			}
			if(isset(height) && isset(hunit)){
				attrs['height'] = height;
				attrs['hunit'] = hunit;
			}
			writer.setAttributes(attrs , me);
        } );
	}
	
	_drop(ve, de, event){
		
		var dropModel = this.editor.editing.mapper.toModelElement(ve);
		if(!dropModel) return;
		if(!this.editor['magicwidget_draged']) return;
		var dragModel = this.editor.editing.mapper.toModelElement(this.editor['magicwidget_draged']);
		if(!dragModel) return;
		
		this.editor.editing.view.change(writer => {
			writer.removeClass('dragover', ve);
		})
		
		this.editor.model.change(writer=>{
			var position = writer.createPositionAfter(dropModel);
			try {
				writer.insert(dragModel, position);
			} catch (e) {
				return;
			}
			
		});
		
	}
	
	_dragOver(ve, de, event){
		if(typeof(allowWidgetOverEvent)=='undefined' || !allowWidgetOverEvent){
			global.allowWidgetOverEvent = true;
			setTimeout(()=>{global.allowWidgetOverEvent = false}, 1000);
			this.editor.editing.view.change(writer => {
				writer.addClass('dragover', ve);
			})
		}
	}
	
	_dragLeave(ve, de, event){
		this.editor.editing.view.change(writer => {
			writer.removeClass('dragover', ve);
		})
	}
	
	_selectWidget(ve, de, evt){
		evt.stopPropagation();
		
		if(!this.editor['magicwidget_selected']) this.editor['magicwidget_selected']={};
		this.editor['magicwidget_selected']={};
		
		var widget = this.editor.editing.mapper.toModelElement(ve.parent);
		
		this.editor.model.change( writer => {
		    var start = writer.createPositionBefore(widget);
		    var end = writer.createPositionAfter(widget);
		    var range = writer.createRange( start, end );
		    writer.setSelection( range );
		});
		
		this.editor['magicwidget_selected'][widget.getAttribute('key')] = widget;
		this._showSelectWidget();
		
		const positions = BalloonPanelView.defaultPositions;
		this.balloonPanel.pin( {
		    target: evt.target,
		    positions: [
		        positions.northArrowSouth,
		        positions.southArrowNorth
		    ]
		} );
		
		this.widthCtrl.setValue(widget.getAttribute('width'), widget.getAttribute('wunit'));
		this.heightCtrl.setValue(widget.getAttribute('height'), widget.getAttribute('hunit'));
		
		
		
	}
	
	_showSelectWidget(){
		this.editor.editing.view.change(writer => {
			var widgets = findChildren(this.editor.model.document.getRoot(), (element)=>{return element.name == 'magic_widget'});
			for (let i in widgets){
				var widget = widgets[i];
				if(widget){
					var widgetView = this.editor.editing.mapper.toViewElement(widget);
					if(widgetView){
						writer.removeClass('selected', widgetView);
					}
				}
			}
			
			for(let i in this.editor['magicwidget_selected']){
				var widget = this.editor['magicwidget_selected'][i];
				if(widget){
					var widgetView = this.editor.editing.mapper.toViewElement(widget);
					if(widgetView){
						writer.addClass('selected', widgetView);
					}
				}
			}
		})
	}

	
	
}





