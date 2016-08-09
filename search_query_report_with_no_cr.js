var impressions_threshold = 100;
var ctr_threshold = 0.5;
var cpcc_threshold = 10; //Cost per converted clicks
var reporting_options = {
  apiVersion: 'v201601'
};
function main() {
  var report = AdWordsApp.report(
      'SELECT Query, Clicks, Cost, Ctr, ClickConversionRate,' +
      ' CostPerConvertedClick, ConvertedClicks, CampaignId, AdGroupId ' +
      ' FROM SEARCH_QUERY_PERFORMANCE_REPORT ' +
      ' WHERE ' +
          ' ConvertedClicks = 0' +
          ' AND Impressions > ' + impressions_threshold +
      ' DURING LAST_7_DAYS', reporting_options);
  var rows = report.rows();
  var negativeKeywords = {};
  var positiveKeywords = {};
  var allAdGroupIds = {};
  while (rows.hasNext()) {
    var row = rows.next();
    if (parseFloat(row['Ctr']) < ctr_threshold) {
      addToMultiMap(negativeKeywords, row['AdGroupId'], row['Query']);
      allAdGroupIds[row['AdGroupId']] = true;
    } else if (parseFloat(row['CostPerConvertedClick']) <
        cpcc_threshold) {
      addToMultiMap(positiveKeywords, row['AdGroupId'], row['Query']);
      allAdGroupIds[row['AdGroupId']] = true;
    }
  }
  var adGroupIdList = [];
  for (var adGroupId in allAdGroupIds) {
    adGroupIdList.push(adGroupId);
  }
  var adGroups = AdWordsApp.adGroups().withIds(adGroupIdList).get();
  while (adGroups.hasNext()) {
    var adGroup = adGroups.next();
    if (negativeKeywords[adGroup.getId()]) {
      for (var i = 0; i < negativeKeywords[adGroup.getId()].length; i++) {
        adGroup.createNegativeKeyword(
            '[' + negativeKeywords[adGroup.getId()][i] + ']');
      }
    }
    if (positiveKeywords[adGroup.getId()]) {
      for (var i = 0; i < positiveKeywords[adGroup.getId()].length; i++) {
        var keywordOperation = adGroup.newKeywordBuilder()
            .withText('[' + positiveKeywords[adGroup.getId()][i] + ']')
            .build();
      }
    }
  }
}
function addToMultiMap(map, key, value) {
  if (!map[key]) {
    map[key] = [];
  }
  map[key].push(value);
}