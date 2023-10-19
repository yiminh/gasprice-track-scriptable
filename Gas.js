// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
let url = "https://static.stacker.com/graphics/gas-price-widget/gas-price-widget-new-york-city.html";
let r = new Request(url);
let htmlContent = await r.loadString();

function extractPrices(content, pattern) {
    let matches = content.match(pattern);
    if (matches && matches.length > 3) {
        return {
            Price: matches[1].trim(),
            WeekChange: matches[2].replace("$", "").trim(),
            YearChange: matches[3].replace("$", "").trim()
        };
    }
    return null;
}

let regexMetro = /<div class=["]?is-active["]? data-content="1">[\s\S]*?<tr>\s*<td style="padding-left: 10px;">Regular<\/td>\s*<td>([^<]+)<\/td>\s*<td class=["]?has-text-success["]?>([^<]+)<\/td>\s*<td class=["]?has-text-success["]?>([^<]+)<\/td>/;
let metroPrices = extractPrices(htmlContent, regexMetro);

let regexState = /<div data-content="2">[\s\S]*?<tr>\s*<td style="padding-left: 10px;">Regular<\/td>\s*<td>([^<]+)<\/td>\s*<td class=["]?has-text-success["]?>([^<]+)<\/td>\s*<td class=["]?has-text-success["]?>([^<]+)<\/td>/;
let statePrices = extractPrices(htmlContent, regexState);

if (!metroPrices || !statePrices) {
    throw new Error("Failed to extract gas prices from the provided HTML content.");
}

let widget = new ListWidget();

let title = widget.addText("GAS Price");
title.font = new Font("Menlo-Regular", 20);
widget.addSpacer();

function addRow(label, price, weekChange, yearChange) {
    let row = widget.addStack();
    row.layoutHorizontally();
    row.useDefaultPadding();

    let labelItem = row.addText(label);
    labelItem.font = new Font("Menlo-Regular", 18);
    row.addSpacer();
  
    let priceItem = row.addText(price);
    priceItem.font = new Font("Menlo-Regular", 18);
    priceItem.rightAlignText = true;
    row.addSpacer();
  
    let weekChangeItem = row.addText(weekChange);
    weekChangeItem.font = new Font("Menlo-Regular", 18);
    weekChangeItem.rightAlignText = true;
    row.addSpacer();

    let yearChangeItem = row.addText(yearChange);
    yearChangeItem.font = new Font("Menlo-Regular", 18);
    yearChangeItem.rightAlignText = true;
    row.addSpacer();
}

addRow("      ", "Price", "1-Week", "1-Year");
widget.addSpacer();
addRow("Local", metroPrices.Price, metroPrices.WeekChange, metroPrices.YearChange);
widget.addSpacer();
addRow("State", statePrices.Price, statePrices.WeekChange, statePrices.YearChange);
widget.addSpacer();

let now = new Date();
let updateRow = widget.addStack();
updateRow.layoutHorizontally();
updateRow.addSpacer();
let update = updateRow.addText(`Last Update: ${now.toLocaleString('default', { month: 'short' })}-${now.getDate()}`);
update.font = new Font("Menlo-Regular", 13);
update.textColor = Color.gray();
update.rightAlignText = true;

if (config.runsInWidget) {
    Script.setWidget(widget);
} else {
    widget.presentMedium();
}

Script.complete();