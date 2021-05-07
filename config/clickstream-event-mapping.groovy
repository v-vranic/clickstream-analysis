mapping {
	map sessionId() onto 'userSession'
	map eventType() onto 'eventType'
	def event = eventParameters()
	map event.value('eventTime') onto 'eventTime'
	map event.value('userId') onto 'userId'
	map event.value('productId') onto 'productId'
	map event.value('categoryId') onto 'categoryId'
	map { parse event.value('price') to fp64 } onto 'price'
	map event.value('categoryCode') onto 'categoryCode'
	map event.value('brand') onto 'brand'
	map event.value('pagePath') onto 'pagePath'
}