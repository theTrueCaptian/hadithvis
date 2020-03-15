#!/usr/bin/env python
# -*- coding: utf-8 -*-
from lxml import html
import requests

sanads = [] #List of sanads

page = requests.get('http://sunnah.com/bukhari/1')
tree = html.fromstring(page.content)
sanad = tree.xpath('//span[@class="arabic_sanad arabic"]/text()') #e.g. sanads: [حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ , ...]
'''
with open('sanad.txt', 'w') as f:
	for row in sanad:
		print row
		f.write("%s\n" % str(row))
'''

for a_sanad in sanad:
	print str(unicode(a_sanad, encoding='utf-8'))