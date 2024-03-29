// defining these up top so we can easily change these later if we need to.
var TICKET_CURRENCY = "TK"; // currecny code for our Tickets VC
var GOLD_CURRENCY = "GL"; // currecny code for our Tickets VC
var PLAYERTOKENS_CURRENCY = "PT"; // currecny code for our Tickets VC

handlers.PlayMatchTickets = function(args)
{
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
		"PlayFabId": currentPlayerId
	};

	var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userInventory = GetUserInventoryResult.Inventory;
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;
	var userVcRecharge = GetUserInventoryResult.VirtualCurrencyRechargeTimes;

	// make sure the player has > 0 Tickets before proceeding. 
	try
	{
		if (!CheckTickets(userVcBalances))
		{
			throw "No Tickets remaining. Purchase additional Tickets or wait: " + userVcRecharge[TICKET_CURRENCY].SecondsToRecharge + " seconds.";
		}
	}
	catch (ex)
	{
		return JSON.stringify(ex);
	}


	var ticketsSpent = 1;
	if (args && args.hasOwnProperty("tp"))
	{
		if (args.tp > 1)
		{
			ticketsSpent = args.tp;
		}
	}


	var goldEarned = 0;
	if (args && args.hasOwnProperty("ge"))
	{
		if (args.ge > goldEarned)
		{
			goldEarned = args.ge;
			AddVc(userVcBalances, GOLD_CURRENCY, goldEarned);
		}
	}



	var playerTokensEarned = 0;
	if (args && args.hasOwnProperty("pt"))
	{
		if (args.pt > playerTokensEarned)
		{
			playerTokensEarned = args.pt;
			AddVc(userVcBalances, PLAYERTOKENS_CURRENCY, playerTokensEarned);
		}
	}



	SubtractVc(userVcBalances, TICKET_CURRENCY, ticketsSpent);

	var winner = true;
	if (args && args.hasOwnProperty("mr"))
	{
		if (args.mr != "Cha")
		{
			winner = false;
		}
	}

	var results = {};

	if (winner)
	{
		results.ts = ticketsSpent;
		results.ge = goldEarned;
		results.pte = playerTokensEarned;
	}

	return JSON.stringify(results);
};


handlers.CheckBuyoutCost = function(args)
{
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
		"PlayFabId": currentPlayerId
	};

	var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;

	// Check how much is the playeroverall, use that as a guide to generate cost
	var playerOverall = 50;
	if (args && args.hasOwnProperty("po"))
	{
		if (args.po > playerOverall)
		{
			playerOverall = args.po;
		}
	}
	var tokensRequired = 1;
	if (args && args.hasOwnProperty("tr"))
	{
		if (args.tr > tokensRequired)
		{
			tokensRequired = args.tr;
		}
	}

	var results = {};
	results.cost = CalculateBuyoutCost(playerOverall, tokensRequired);

	return JSON.stringify(results);
};

handlers.BuyoutPlayer = function(args)
{
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
		"PlayFabId": currentPlayerId
	};

	var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;

	// Check how much is the playeroverall, use that as a guide to generate cost
	var playerOverall = 50;
	if (args && args.hasOwnProperty("po"))
	{
		if (args.po > playerOverall)
		{
			playerOverall = args.po;
		}
	}
	var tokensRequired = 1;
	if (args && args.hasOwnProperty("tr"))
	{
		if (args.tr > tokensRequired)
		{
			tokensRequired = args.tr;
		}
	}

	var amountRequired = CalculateBuyoutCost(playerOverall, tokensRequired);
	var purchased = HasEnough(userVcBalances, GOLD_CURRENCY, amountRequired);

	if (purchased)
	{
		SubtractVc(userVcBalances, GOLD_CURRENCY, amountRequired);
	}

	var results = {};
	results.bought = purchased;

	return JSON.stringify(results);
};


handlers.SellPlayerTokens = function(args)
{
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
		"PlayFabId": currentPlayerId
	};

	var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;

	// Check how much is the playeroverall, use that as a guide to generate cost
	var playerOverall = 50;
	if (args && args.hasOwnProperty("po"))
	{
		if (args.po > playerOverall)
		{
			playerOverall = args.po;
		}
	}
	var tokens = 1;
	if (args && args.hasOwnProperty("tk"))
	{
		if (args.tk > tokens)
		{
			tokens = args.tk;
		}
	}

	AddVc(userVcBalances, GOLD_CURRENCY, CalculateSellPriceTokens(playerOverall, tokens));

// get gold for selling players
	return JSON.stringify(true);
};


handlers.CheckTokenSellPrice = function(args)
{
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
		"PlayFabId": currentPlayerId
	};

	var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;

	// Check how much is the playeroverall, use that as a guide to generate cost
	var playerOverall = 50;
	if (args && args.hasOwnProperty("po"))
	{
		if (args.po > playerOverall)
		{
			playerOverall = args.po;
		}
	}
	var tokensRequired = 1;
	if (args && args.hasOwnProperty("tr"))
	{
		if (args.tr > tokensRequired)
		{
			tokensRequired = args.tr;
		}
	}

	return JSON.stringify(CalculateSellPriceTokens(playerOverall, tokensRequired));
};




function CalculateBuyoutCost(ovr, count)
{
	var GetTitleDataRequest = {
		"Keys": ["playerTokenData"]
	};
	var GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
	var playerTokenData = JSON.parse(GetTitleDataResult.Data["playerTokenData"]);


	var multiplier = 50;
	if (playerTokenData.hasOwnProperty("buyoutMultiplier"))
	{
		multiplier = playerTokenData.buyoutMultiplier;
	}

	if (ovr > 89)
	{
		if (playerTokenData.hasOwnProperty("buyoutOvr90"))
		{
			multiplier = playerTokenData.buyoutOvr90;
		}
	}
	else if (ovr > 79)
	{
		if (playerTokenData.hasOwnProperty("buyoutOvr80"))
		{
			multiplier = playerTokenData.buyoutOvr80;
		}
	}
	else if (ovr > 69)
	{
		if (playerTokenData.hasOwnProperty("buyoutOvr70"))
		{
			multiplier = playerTokenData.buyoutOvr70;
		}
	}
	else if (ovr > 59)
	{
		if (playerTokenData.hasOwnProperty("buyoutOvr60"))
		{
			multiplier = playerTokenData.buyoutOvr60;
		}
	}

	return ovr * count * multiplier;
}

function CalculateSellPriceTokens(ovr, count)
{
	var GetTitleDataRequest = {
		"Keys": ["playerTokenData"]
	};
	var GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
	var playerTokenData = JSON.parse(GetTitleDataResult.Data["playerTokenData"]);

	var multiplier = 15;
	if (playerTokenData.hasOwnProperty("buyoutMultiplier"))
	{
		multiplier = playerTokenData.buyoutMultiplier;
	}
	return Math.floor(ovr * count * multiplier * 0.5);
}

function HasEnough(vcBalnces, currency, required)
{
	if (vcBalnces != null && vcBalnces.hasOwnProperty(currency) && vcBalnces[currency] >= required)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function CheckTickets(vcBalnces)
{
	return HasEnough(vcBalnces, TICKET_CURRENCY, 1);
}

function AddVc(vcBalnces, code, qty)
{
	if (vcBalnces != null && vcBalnces.hasOwnProperty(code) && vcBalnces[code] > 0)
	{
		vcBalnces[code] += qty;
	}

	var AddUserVirtualCurrencyRequest = {
		"PlayFabId": currentPlayerId,
		"VirtualCurrency": code,
		"Amount": qty
	};
	var AddUserVirtualCurrencyResult = server.AddUserVirtualCurrency(AddUserVirtualCurrencyRequest);
}

function SubtractVc(vcBalnces, code, qty)
{
	if (vcBalnces != null && vcBalnces.hasOwnProperty(code) && vcBalnces[code] > 0)
	{
		vcBalnces[code] -= qty;
	}

	var SubtractUserVirtualCurrencyRequest = {
		"PlayFabId": currentPlayerId,
		"VirtualCurrency": code,
		"Amount": qty
	};

	var SubtractUserVirtualCurrencyResult = server.SubtractUserVirtualCurrency(SubtractUserVirtualCurrencyRequest);
}