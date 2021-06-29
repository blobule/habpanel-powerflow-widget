# habpanel-powerflow-widget

Power flow SVG widget for Habpanel (OpenHAB)
Allows displaying values inside an SVG as well as animation based on item states.

## Features

The power-flow connects to 6 openhab items:
- 'house' is kW total house power usage (displayed as text)
- 'bat' : battery charge in kwH (displayed as text)
- 'p1' : grid power to the house (displayed as text and animation)
- 'p2' : solar power to the house (displayed as text and animation)
- 'p3' : battery power delivered to (received from) the house (displayed as text and animation)
- 'p4' : thermal power to the house (displayed as text and animation)

The code is easy to change in order to accomodate other SVG and item selections.

## History

- 2021-07-29 published!

### Parameters

The widget can be configured in habpanel.
The only configuration available is the selection of items to display.

- 'house', 'bat' : value displayed as text
- 'p1, to 'p4' : values displayed as text and as animation

## Screenshot

![screenshot](img/power-flow-anim.gif)

## Settings

(sorry for the mixture of languages)

In french, but you get the idea...

![settings](img/power-flow-settings.png)

## Demo

A standalone demo is provided in [powerFlow/index.html](powerFlow/index.html)

## Installing

This widget relies on static files, which must be installed manually.
Simply copy the directory powerFlow into the static html area of openhab.

For openraspbian, just do

`cp -r thermoKnob /etc/openhab2/html/`

If you install the file elsewhere, make sure you adjust the widget [power-flow.widget.json](power-flow.widget.json) file accordingly.

