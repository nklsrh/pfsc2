
handlers.GetFreeAgentSecondTryPrice = function(args)
{
	var GetTitleDataRequest = {
		"Keys": ["playerTokenData"]
	};
	var GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
	var playerTokenData = JSON.parse(GetTitleDataResult.Data["playerTokenData"]);
	
	var numTries = 1;
	if (args && args.hasOwnProperty("tries"))
	{
		if (args.tries > numTries)
		{
			numTries = args.tries;
		}
	}

	var priceMultiplier = 50;
	if (playerTokenData.hasOwnProperty("freeAgentSecondTryPriceMultiplier"))
	{
		priceMultiplier = playerTokenData.freeAgentSecondTryPriceMultiplier;
	}

	var pack = "Bronze";
	if (args && args.hasOwnProperty("pk"))
	{
		pack = args.pk;
	}

	var packID = "FreeAgentSecondTryPrice" + pack;
	var packSecondTryPrice = 100;
	log.info("PACK ID EXIST? " + packID);
	for (var id in playerTokenData)
	{
		log.info("CHECK ID ? " + id);
		if (id == packID)
		{
			packSecondTryPrice = playerTokenData[id];
			log.info("PACKYTES packSecondTryPrice? " + packSecondTryPrice);
		}
	}
	log.info("SECOND PRICE? " + priceMultiplier + " " + numTries + " " + pack + " " + packSecondTryPrice);

	return JSON.stringify(CalculateSecondTryPrice(priceMultiplier, numTries, pack, packSecondTryPrice));
};


handlers.BuyFreeAgentSecondTry = function(args)
{
	var GetTitleDataRequest = {
		"Keys": ["playerTokenData"]
	};
	var GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
	var playerTokenData = JSON.parse(GetTitleDataResult.Data["playerTokenData"]);
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
		"PlayFabId": currentPlayerId
	};
	var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;
	
	var numTries = 1;
	if (args && args.hasOwnProperty("tries"))
	{
		if (args.tries > numTries)
		{
			numTries = args.tries;
		}
	}

	var priceMultiplier = 50;
	if (playerTokenData.hasOwnProperty("freeAgentSecondTryPriceMultiplier"))
	{
		priceMultiplier = playerTokenData.freeAgentSecondTryPriceMultiplier;
	}

	var pack = "Bronze";
	if (args && args.hasOwnProperty("pk"))
	{
		pack = args.pk;
	}

	var packID = "FreeAgentSecondTryPrice" + pack;
	var packSecondTryPrice = 100;
	log.info("PACK ID EXIST? " + packID);

	if (playerTokenData.hasOwnProperty(packID))
	{
		packSecondTryPrice = playerTokenData[packID];
		log.info("PACKYTES packSecondTryPrice? " + packSecondTryPrice);
	}

	var amountRequired = CalculateSecondTryPrice(priceMultiplier, numTries, pack, packSecondTryPrice);
	var purchased = HasEnough(userVcBalances, GOLD_CURRENCY, amountRequired);

	if (purchased)
	{
		SubtractVc(userVcBalances, GOLD_CURRENCY, amountRequired);
	}

	var results = {};
	results.bought = purchased;

	return JSON.stringify(results);
};



function CalculateSecondTryPrice(priceMultiplier, numTries, pack, packSecondTryPrice)
{
	log.info("PACK NAME " + pack);

	var finalPriceOfSecondTry = priceMultiplier * numTries * packSecondTryPrice;

	return finalPriceOfSecondTry;
}


// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================