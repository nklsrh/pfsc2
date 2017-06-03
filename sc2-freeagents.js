
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

	return JSON.stringify(CalculateSecondTryPrice(priceMultiplier, numTries, pack));
};


handlers.BuyFreeAgentSecondTry = function(args)
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

	var amountRequired = CalculateSecondTryPrice(priceMultiplier, numTries, priceOfTry);
	var purchased = HasEnough(userVcBalances, GOLD_CURRENCY, amountRequired);

	if (purchased)
	{
		SubtractVc(userVcBalances, GOLD_CURRENCY, amountRequired);
	}

	var results = {};
	results.bought = purchased;

	return JSON.stringify(results);
};



function CalculateSecondTryPrice(priceMultiplier, numTries, pack)
{
	log.info("PACK NAME " + pack);
	log.info("PACK BRONZE PRICE " + playerTokenData["FreeAgentSecondTryPriceBronze"]);

	var priceOfTry = 1000;
	priceOfTry = parseInt(playerTokenData["FreeAgentSecondTryPrice" + pack]);

	var finalPriceOfSecondTry = priceMultiplier * numTries * priceOfTry;

	return ovr * count * multiplier;
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