// defining these up top so we can easily change these later if we need to.
var FREEAGENTREFRESH_CURRENCY = "FA"; // currecny code for our Tickets VC

handlers.BuyFreeAgentRefresh = function(args)
{
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
		"PlayFabId": currentPlayerId
	};

	var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;

	var amountRequired = 1200;
	amountRequired = GetRefreshPrice();
	var purchased = HasEnough(userVcBalances, GOLD_CURRENCY, amountRequired);

	if (purchased)
	{
		SubtractVc(userVcBalances, GOLD_CURRENCY, amountRequired);
	}

	var results = purchased;

	return JSON.stringify(results);
};


handlers.GetRefreshPrice = function(args)
{
	var GetTitleDataRequest = {
		"Keys": ["playerTokenData"]
	};
	var GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
	var playerTokenData = JSON.parse(GetTitleDataResult.Data["playerTokenData"]);

	var refreshPrice = 1200;
	if (playerTokenData.hasOwnProperty("freeAgentRefreshPrice"))
	{
		refreshPrice = playerTokenData.freeAgentRefreshPrice;
	}
	return refreshPrice;
};