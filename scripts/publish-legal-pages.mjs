#!/usr/bin/env node
/**
 * Publish Terms of Service + Return & Refund Policy to Shopify Admin pages.
 * Usage: node scripts/publish-legal-pages.mjs zhjbdz-yw.myshopify.com
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, platform } from 'node:os';
import { join } from 'node:path';

const store = process.argv[2] || 'zhjbdz-yw.myshopify.com';
const isWin = platform() === 'win32';
const shopifyCmd = isWin ? 'shopify.cmd' : 'shopify';

const TERMS_BODY = `
<p><strong>Effective Date: September 3, 2026</strong></p>
<p>Welcome to <strong>NeroCasa</strong>.</p>
<p>These Terms of Service ("Terms") govern your access to and use of the NeroCasa website, including the purchase of marble furniture, décor, custom-made products, and related services.</p>
<p>By accessing our website, submitting an enquiry, placing an order, or purchasing a product through our website, you acknowledge that you have read, understood, and agreed to these Terms, subject always to your rights under applicable laws and regulations of the United Arab Emirates.</p>
<p>NeroCasa is a luxury marble furniture and design brand backed by <strong>AL SOURAH AL THAHABIAH MARBEL &amp; GRANITE TR LLC</strong>.</p>
<p>For the purposes of these Terms, <strong>"NeroCasa", "Nero Casa", "we", "us", and "our"</strong> refer to NeroCasa and the business operating the website and providing the products and services described on it.</p>
<p><strong>Business Name:</strong> NeroCasa<br>
<strong>Website:</strong> <a href="https://nerocasa.com/">https://nerocasa.com/</a><br>
<strong>Email:</strong> <a href="mailto:nerocasamarbles@gmail.com">nerocasamarbles@gmail.com</a><br>
<strong>Phone / WhatsApp:</strong> +971 50 858 8828<br>
<strong>Country of Operation:</strong> United Arab Emirates<br>
<strong>Manufacturing / Business Support:</strong> AL SOURAH AL THAHABIAH MARBEL &amp; GRANITE TR LLC</p>

<h2>1. ACCEPTANCE OF THESE TERMS</h2>
<p>By using the NeroCasa website, submitting an enquiry, or placing an order, you agree to comply with these Terms and the other policies published on our website, including:</p>
<ul>
<li>Return &amp; Refund Policy;</li>
<li>Shipping &amp; Delivery Policy;</li>
<li>Privacy Policy; and</li>
<li>Legal Notice.</li>
</ul>
<p>These documents together govern your use of the website and your transactions with NeroCasa.</p>
<p>If you do not agree with these Terms, please do not use the website or place an order.</p>
<p>Nothing in these Terms is intended to exclude, restrict, or remove any mandatory rights or protections available to consumers under applicable UAE law.</p>

<h2>2. ELIGIBILITY</h2>
<p>You must have the legal capacity to enter into a binding agreement in order to place an order through our website.</p>
<p>If you place an order on behalf of another individual, company, business, or organization, you confirm that you have the authority to do so.</p>

<h2>3. OUR PRODUCTS</h2>
<p>NeroCasa offers luxury marble furniture, décor, and related products, including but not limited to:</p>
<ul>
<li>Coffee tables;</li>
<li>Side tables;</li>
<li>Console tables;</li>
<li>Custom-designed furniture;</li>
<li>Custom marble pieces; and</li>
<li>Other furniture and design pieces displayed on the website from time to time.</li>
</ul>
<p>Our products are generally <strong>made to order</strong>.</p>
<p>Products may be manufactured according to specifications selected or approved by the customer.</p>
<p>These specifications may include:</p>
<ul>
<li>Dimensions;</li>
<li>Marble type;</li>
<li>Marble colour;</li>
<li>Marble selection;</li>
<li>Shape;</li>
<li>Edge profile;</li>
<li>Base design;</li>
<li>Base material;</li>
<li>Finish; and</li>
<li>Other agreed customization requirements.</li>
</ul>

<h2>4. NATURAL MARBLE</h2>
<p>Marble is a natural stone and each slab is unique.</p>
<p>Natural variations may occur in:</p>
<ul>
<li>Veining;</li>
<li>Colour;</li>
<li>Shade;</li>
<li>Texture;</li>
<li>Mineral deposits;</li>
<li>Patterns;</li>
<li>Small pores;</li>
<li>Fossils;</li>
<li>Markings; and</li>
<li>Other natural characteristics.</li>
</ul>
<p>These variations are inherent characteristics of natural marble and do not automatically constitute defects.</p>
<p>Product photographs displayed on the website are provided for visual representation. The finished product may differ from website or social-media photographs because of natural stone variation, lighting, photography, display settings, and the individual characteristics of each marble slab.</p>
<p>Where possible, NeroCasa will make reasonable efforts to select marble consistent with the customer's selected or approved material.</p>
<p>However, exact replication of a particular photographed slab or piece cannot always be guaranteed.</p>

<h2>5. PRODUCT INFORMATION</h2>
<p>We make reasonable efforts to ensure that product descriptions, dimensions, photographs, materials, colours, prices, and specifications displayed on the website are accurate.</p>
<p>Minor variations may occur.</p>
<p>Customers are responsible for reviewing product information carefully before placing an order.</p>
<p>For custom or made-to-order products, the specifications approved by the customer may be used as the basis for manufacturing.</p>

<h2>6. MADE-TO-ORDER PRODUCTS</h2>
<p>NeroCasa products are generally manufactured after an order has been placed and the relevant specifications have been confirmed.</p>
<p>Because products are made specifically for customers, production may begin shortly after an order and specification approval has been received.</p>
<p>Once production has commenced, cancellation or modification due solely to a change of mind may not be possible.</p>
<p>The customer's rights concerning cancellation, returns, refunds, defective products, damaged products, and non-conforming products are governed by our Return &amp; Refund Policy and applicable UAE law.</p>

<h2>7. CUSTOM DESIGNS</h2>
<p>NeroCasa accepts requests for custom-made furniture and designs.</p>
<p>Customers may provide:</p>
<ul>
<li>Measurements;</li>
<li>Images;</li>
<li>References;</li>
<li>Drawings;</li>
<li>Concepts;</li>
<li>Design ideas; or</li>
<li>Other relevant information.</li>
</ul>
<p>Custom projects may require confirmation of:</p>
<ul>
<li>Design;</li>
<li>Dimensions;</li>
<li>Marble;</li>
<li>Finish;</li>
<li>Materials;</li>
<li>Structural requirements;</li>
<li>Price;</li>
<li>Production requirements; and</li>
<li>Delivery and installation requirements.</li>
</ul>
<p>NeroCasa may decline a custom design request where the proposed design cannot reasonably or safely be manufactured, required materials are unavailable, or for another legitimate technical or commercial reason.</p>
<p>A custom order will proceed only after the relevant specifications and commercial terms have been agreed.</p>

<h2>8. CUSTOMER-PROVIDED MEASUREMENTS</h2>
<p>Where a customer provides measurements, dimensions, drawings, specifications, or other information for a custom product, the customer is responsible for ensuring that the information supplied is accurate unless NeroCasa has expressly agreed to measure or verify it.</p>
<p>Customers should consider all relevant access and installation requirements, including:</p>
<ul>
<li>Doorways;</li>
<li>Entrances;</li>
<li>Corridors;</li>
<li>Stairways;</li>
<li>Elevators;</li>
<li>Parking and loading areas;</li>
<li>Building restrictions; and</li>
<li>The intended installation area.</li>
</ul>
<p>If incorrect measurements or specifications supplied or approved by the customer result in an unsuitable product, NeroCasa may not be responsible for the resulting incompatibility, except where the issue resulted from an error attributable to NeroCasa.</p>

<h2>9. ORDERS</h2>
<p>An order submitted through the website constitutes an offer by the customer to purchase the selected product.</p>
<p>Orders are subject to successful payment, specification confirmation, material availability, technical feasibility, and other reasonable checks.</p>
<p>NeroCasa reserves the right to decline or cancel an order where:</p>
<ul>
<li>A product or material is unavailable;</li>
<li>A genuine pricing or listing error has occurred;</li>
<li>A requested product cannot reasonably be manufactured;</li>
<li>Payment cannot be successfully processed;</li>
<li>Information provided by the customer is materially inaccurate or incomplete;</li>
<li>The order appears fraudulent or unauthorized; or</li>
<li>Cancellation is required or permitted under applicable law.</li>
</ul>
<p>Where an order is cancelled after payment has been received and the customer is legally entitled to a refund, the applicable amount will be refunded to the original payment method unless otherwise agreed or required by law.</p>

<h2>10. PRICES</h2>
<p>Prices displayed on the website are the prices applicable at the time the order is placed, unless otherwise stated.</p>
<p>NeroCasa may change prices at any time before an order is placed.</p>
<p>Once an order has been accepted and payment successfully received, the agreed purchase price will generally apply to that order, subject to genuine pricing errors and applicable law.</p>
<p>Any applicable taxes or charges required by law will be disclosed where applicable.</p>

<h2>11. PAYMENT</h2>
<h3>E-Commerce Orders</h3>
<p>For purchases made through the NeroCasa website, <strong>full payment is required at checkout</strong> unless NeroCasa expressly agrees otherwise in writing.</p>
<p>Production will generally begin after the required payment has been successfully received and the necessary specifications have been confirmed.</p>
<h3>B2B Orders</h3>
<p>B2B and commercial orders may be governed by separate quotations, invoices, purchase orders, or written agreements.</p>
<p>Unless otherwise agreed in writing, the standard B2B payment structure is:</p>
<p><strong>70% upfront, with the remaining 30% payable according to the agreed B2B terms.</strong></p>
<p>Where a separate written B2B agreement, quotation, invoice, or purchase order has been accepted by both parties, its specific terms will govern that transaction to the extent permitted by applicable law.</p>

<h2>12. PAYMENT PROCESSING</h2>
<p>Payments may be processed through third-party payment providers.</p>
<p>By submitting payment information, you confirm that you are authorized to use the payment method.</p>
<p>If a payment is declined, reversed, disputed, or otherwise unsuccessful, NeroCasa may suspend production or delivery until payment has been successfully completed, subject to applicable law.</p>

<h2>13. PRODUCTION AND DELIVERY TIME</h2>
<p>NeroCasa products are made to order.</p>
<p>Our standard estimated timeframe for e-commerce orders is:</p>
<p><strong>3–7 business days for production and delivery.</strong></p>
<p>This is an estimated timeframe and may vary depending on:</p>
<ul>
<li>Product complexity;</li>
<li>Customization;</li>
<li>Material availability;</li>
<li>Customer approval;</li>
<li>Production requirements;</li>
<li>Delivery access;</li>
<li>Installation requirements; and</li>
<li>Circumstances outside our reasonable control.</li>
</ul>
<p>NeroCasa will make reasonable efforts to complete and deliver orders within the estimated timeframe.</p>
<p>Further information is provided in our Shipping &amp; Delivery Policy.</p>

<h2>14. SHIPPING WITHIN THE UAE</h2>
<p>NeroCasa currently delivers to customers within the <strong>United Arab Emirates</strong>.</p>
<p>Standard delivery for e-commerce orders is <strong>free</strong>, unless otherwise stated for a specific order.</p>
<p>Delivery may be performed by NeroCasa or an appointed delivery provider.</p>
<p>Customers are responsible for providing accurate delivery information.</p>

<h2>15. DELIVERY ACCESS</h2>
<p>Customers must ensure that the delivery location can reasonably accommodate the furniture.</p>
<p>Customers should inform NeroCasa in advance of relevant access restrictions, including:</p>
<ul>
<li>Narrow entrances;</li>
<li>Stairs;</li>
<li>Small elevators;</li>
<li>Building access restrictions;</li>
<li>Security requirements;</li>
<li>Loading restrictions;</li>
<li>Parking restrictions; or</li>
<li>Other circumstances that could affect delivery or installation.</li>
</ul>
<p>If the customer fails to provide relevant information and delivery cannot reasonably be completed, the delivery may need to be rescheduled.</p>

<h2>16. INSTALLATION</h2>
<p>NeroCasa provides installation for applicable furniture as part of its delivery service.</p>
<p>Customers must ensure that the intended installation area is ready and reasonably accessible.</p>
<p>NeroCasa's installation service relates to the furniture supplied by NeroCasa.</p>
<p>NeroCasa is not responsible for pre-existing structural, flooring, wall, electrical, plumbing, or other site conditions outside the scope of the furniture installation.</p>

<h2>17. INSPECTION UPON DELIVERY</h2>
<p>Customers are encouraged to inspect their furniture upon delivery and installation.</p>
<p>If visible damage is identified during delivery or installation, customers should notify the NeroCasa delivery or installation team immediately and document the issue with photographs where possible.</p>
<p>Damage, defects, incorrect products, or products materially different from the agreed specifications will be handled in accordance with the Return &amp; Refund Policy and applicable UAE law.</p>

<h2>18. RETURNS, REFUNDS AND EXCHANGES</h2>
<p>Returns, cancellations, refunds, and exchanges are governed by NeroCasa's <strong>Return &amp; Refund Policy</strong>.</p>
<p>Because our products are made to order, custom-made or personalized products may not qualify for change-of-mind cancellation or return once production has commenced.</p>
<p>Nothing in these Terms or the Return &amp; Refund Policy removes or limits any mandatory consumer rights available under applicable UAE law.</p>

<h2>19. CUSTOMER RESPONSIBILITY FOR PRODUCT CARE</h2>
<p>Customers are responsible for using and caring for their furniture appropriately.</p>
<p>Customers should follow all care, cleaning, handling, installation, and maintenance instructions provided by NeroCasa.</p>
<p>Damage caused by improper use, inappropriate cleaning products, excessive heat, impact, unauthorized modification, improper movement, third-party installation, or failure to follow care instructions may not be covered by the Return &amp; Refund Policy.</p>
<p>This does not affect rights relating to manufacturing defects or other matters for which NeroCasa is legally responsible.</p>

<h2>20. WEBSITE USE</h2>
<p>You agree to use the NeroCasa website only for lawful purposes.</p>
<p>You must not:</p>
<ul>
<li>Use the website for fraudulent purposes;</li>
<li>Attempt to gain unauthorized access to the website or its systems;</li>
<li>Interfere with website functionality;</li>
<li>Introduce malicious software or harmful code;</li>
<li>Copy substantial website content without authorization;</li>
<li>Use automated systems to improperly extract website content;</li>
<li>Submit false or misleading information;</li>
<li>Impersonate another person or business; or</li>
<li>Use the website in violation of applicable law.</li>
</ul>
<p>NeroCasa may restrict access where reasonably necessary to protect the website, customers, business, or legal rights, subject to applicable law.</p>

<h2>21. INTELLECTUAL PROPERTY</h2>
<p>Unless otherwise stated, all content appearing on the NeroCasa website is owned by or licensed to NeroCasa or the applicable rights holder.</p>
<p>This includes:</p>
<ul>
<li>NeroCasa branding;</li>
<li>Logos;</li>
<li>Names;</li>
<li>Product photography;</li>
<li>Videos;</li>
<li>Graphics;</li>
<li>Website design;</li>
<li>Product descriptions;</li>
<li>Written content;</li>
<li>Layouts;</li>
<li>Design elements; and</li>
<li>Other original materials.</li>
</ul>
<p>You may access and use the website for personal and lawful purposes.</p>
<p>You may not reproduce, modify, distribute, publish, commercially exploit, or create derivative works from NeroCasa content without prior written permission, except where permitted by applicable law.</p>

<h2>22. CUSTOMER-SUBMITTED MATERIALS</h2>
<p>Customers may submit photographs, drawings, references, measurements, designs, concepts, or other materials when requesting a custom product.</p>
<p>By submitting such materials, you confirm that you have the right to provide them and that doing so does not unlawfully infringe another person's rights.</p>
<p>You grant NeroCasa permission to use submitted materials as reasonably necessary to:</p>
<ul>
<li>Review your request;</li>
<li>Communicate with you;</li>
<li>Develop the requested product;</li>
<li>Manufacture the product;</li>
<li>Arrange delivery and installation; and</li>
<li>Fulfil the order.</li>
</ul>
<p>NeroCasa does not acquire ownership of a customer's underlying intellectual property merely because it has been submitted to us, unless a separate written agreement provides otherwise.</p>

<h2>23. NEROCASA DESIGNS</h2>
<p>NeroCasa may develop its own original furniture designs, concepts, drawings, manufacturing methods, and design elements.</p>
<p>Unless otherwise agreed in writing, NeroCasa retains its rights in its own pre-existing designs, concepts, manufacturing methods, and intellectual property.</p>
<p>Purchasing a physical NeroCasa product does not automatically transfer ownership of NeroCasa's intellectual property.</p>
<p>Where a custom project involves customer-owned intellectual property or separately commissioned design work, ownership and permitted use may be agreed separately in writing.</p>

<h2>24. THIRD-PARTY SERVICES</h2>
<p>NeroCasa may use third-party providers for services including:</p>
<ul>
<li>Payment processing;</li>
<li>Website hosting;</li>
<li>Delivery;</li>
<li>Installation;</li>
<li>Communications;</li>
<li>Technology services;</li>
<li>Analytics; and</li>
<li>Other operational services.</li>
</ul>
<p>Third-party providers may have their own terms and policies.</p>
<p>NeroCasa remains responsible for its obligations to customers as required by applicable UAE law.</p>

<h2>25. WEBSITE AVAILABILITY</h2>
<p>NeroCasa aims to maintain a reliable and functional website.</p>
<p>However, we do not guarantee that the website will always be:</p>
<ul>
<li>Available;</li>
<li>Uninterrupted;</li>
<li>Error-free;</li>
<li>Free from technical defects; or</li>
<li>Completely secure against every possible threat.</li>
</ul>
<p>Temporary interruptions may occur because of maintenance, technical issues, hosting problems, security incidents, telecommunications failures, or other circumstances.</p>

<h2>26. ERRORS AND CORRECTIONS</h2>
<p>NeroCasa may correct genuine errors or inaccuracies on the website, including errors involving:</p>
<ul>
<li>Prices;</li>
<li>Product descriptions;</li>
<li>Dimensions;</li>
<li>Materials;</li>
<li>Images;</li>
<li>Availability; or</li>
<li>Other product information.</li>
</ul>
<p>If an error materially affects an order that has already been placed, NeroCasa will take reasonable steps to notify the customer and provide an appropriate solution consistent with applicable law.</p>

<h2>27. FORCE MAJEURE</h2>
<p>NeroCasa will not be responsible for delays or failure to perform an obligation to the extent caused by circumstances beyond our reasonable control.</p>
<p>Such circumstances may include:</p>
<ul>
<li>Natural disasters;</li>
<li>Severe weather;</li>
<li>Fire;</li>
<li>Flood;</li>
<li>Government action;</li>
<li>Regulatory restrictions;</li>
<li>Transportation disruption;</li>
<li>Supply-chain disruption;</li>
<li>Material shortages;</li>
<li>Industrial disputes;</li>
<li>Power or telecommunications failures;</li>
<li>Serious technical failures;</li>
<li>Security incidents; or</li>
<li>Other circumstances beyond our reasonable control.</li>
</ul>
<p>Where such circumstances occur, NeroCasa will take reasonable steps to minimize their effect and resume performance as soon as reasonably practicable.</p>

<h2>28. LIMITATION OF LIABILITY</h2>
<p>Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited under applicable UAE law.</p>
<p>Subject to that requirement, NeroCasa will not be responsible for losses resulting solely from:</p>
<ul>
<li>Incorrect information supplied by the customer;</li>
<li>Incorrect dimensions or specifications approved by the customer;</li>
<li>Improper use of a product;</li>
<li>Unauthorized modification or repair;</li>
<li>Improper third-party installation;</li>
<li>Failure to follow product-care instructions; or</li>
<li>Other circumstances caused by the customer's acts or omissions.</li>
</ul>
<p>Nothing in this section affects mandatory consumer rights concerning defective, damaged, unsafe, or non-conforming goods.</p>

<h2>29. CONSUMER PROTECTION</h2>
<p>NeroCasa respects the consumer rights and protections provided under applicable laws and regulations of the United Arab Emirates.</p>
<p>UAE consumer-protection legislation applies to relevant goods and services supplied within the UAE, including applicable e-commerce transactions.</p>
<p>These Terms are not intended to deprive customers of mandatory legal rights.</p>
<p>Where a provision of these Terms conflicts with a mandatory requirement of UAE law, the mandatory legal requirement will prevail to the extent of that conflict.</p>

<h2>30. PRIVACY AND CUSTOMER INFORMATION</h2>
<p>NeroCasa may collect and process information necessary to:</p>
<ul>
<li>Process orders;</li>
<li>Process payments;</li>
<li>Manufacture products;</li>
<li>Arrange delivery;</li>
<li>Arrange installation;</li>
<li>Communicate with customers;</li>
<li>Provide customer service;</li>
<li>Comply with legal obligations; and</li>
<li>Operate and improve our services.</li>
</ul>
<p>Customer information will be handled in accordance with our Privacy Policy and applicable UAE laws.</p>

<h2>31. CUSTOMER COMMUNICATIONS</h2>
<p>By placing an order or submitting an enquiry, you agree that NeroCasa may contact you using the information you provide where reasonably necessary to:</p>
<ul>
<li>Confirm an order;</li>
<li>Confirm specifications;</li>
<li>Discuss a custom design;</li>
<li>Arrange production;</li>
<li>Arrange delivery;</li>
<li>Arrange installation;</li>
<li>Address an issue;</li>
<li>Process a return or refund; or</li>
<li>Provide customer support.</li>
</ul>
<p>Marketing communications will be handled in accordance with applicable law.</p>

<h2>32. B2B ORDERS</h2>
<p>B2B and commercial orders may be subject to separate quotations, invoices, purchase orders, specifications, payment schedules, delivery arrangements, or written agreements.</p>
<p>Unless otherwise agreed in writing, the standard B2B payment structure is <strong>70% upfront</strong>, with the remaining balance payable according to the agreed commercial terms.</p>
<p>Where a separate written B2B agreement exists, its specific provisions will govern the relevant transaction to the extent permitted by applicable law.</p>

<h2>33. LINKS TO THIRD-PARTY WEBSITES</h2>
<p>The NeroCasa website may contain links to third-party websites or services.</p>
<p>These links may be provided for convenience.</p>
<p>NeroCasa does not necessarily endorse third-party websites and is not responsible for their content, availability, security, or practices.</p>

<h2>34. CHANGES TO THESE TERMS</h2>
<p>NeroCasa may update these Terms from time to time to reflect changes in:</p>
<ul>
<li>Our products;</li>
<li>Services;</li>
<li>Business practices;</li>
<li>Website functionality; or</li>
<li>Legal requirements.</li>
</ul>
<p>The updated version will be published on the website with a revised effective date.</p>
<p>The version generally applicable to an order will be the version in effect when the order was placed, subject to applicable law and any specific agreement governing that order.</p>

<h2>35. SEVERABILITY</h2>
<p>If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision will be interpreted or modified to the extent necessary to make it legally effective where possible.</p>
<p>If it cannot be made effective, it will be treated as severed to the extent required without affecting the validity of the remaining provisions.</p>

<h2>36. NO WAIVER</h2>
<p>If NeroCasa does not immediately enforce a provision of these Terms, this does not mean that NeroCasa has permanently waived its right to enforce that provision.</p>
<p>A waiver in one circumstance does not automatically constitute a waiver in another circumstance.</p>

<h2>37. ENTIRE AGREEMENT</h2>
<p>These Terms, together with the applicable:</p>
<ul>
<li>Product information;</li>
<li>Order confirmation;</li>
<li>Return &amp; Refund Policy;</li>
<li>Shipping &amp; Delivery Policy;</li>
<li>Privacy Policy;</li>
<li>Legal Notice; and</li>
<li>Any specific written agreement applicable to an order,</li>
</ul>
<p>form the terms governing the relevant transaction.</p>
<p>For B2B or custom projects, a separate written agreement may contain additional terms specific to that transaction.</p>

<h2>38. GOVERNING LAW</h2>
<p>These Terms and transactions made through the NeroCasa website are governed by the applicable laws of the <strong>United Arab Emirates</strong>.</p>
<p>Nothing in this section prevents a consumer from exercising mandatory rights or remedies available under applicable UAE law.</p>
<p>Any dispute will be handled by the competent courts or authorities having jurisdiction under applicable UAE law.</p>

<h2>39. LANGUAGE</h2>
<p>NeroCasa may provide these Terms in English and Arabic.</p>
<p>Where required by applicable UAE law, consumer-facing contractual information will be made available in Arabic, with English or other languages provided alongside it where appropriate.</p>
<p>If there is a discrepancy between language versions, the version that must legally prevail under applicable UAE law will apply.</p>

<h2>40. CONTACT US</h2>
<p>For questions regarding these Terms, an order, a product, a custom design, delivery, installation, returns, or any other NeroCasa service, please contact us:</p>
<p><strong>NeroCasa</strong></p>
<p><strong>Email:</strong> <a href="mailto:nerocasamarbles@gmail.com">nerocasamarbles@gmail.com</a><br>
<strong>Phone / WhatsApp:</strong> +971 50 858 8828<br>
<strong>Website:</strong> <a href="https://nerocasa.com/">https://nerocasa.com/</a></p>
<p><strong>Backed by:</strong><br>
<strong>AL SOURAH AL THAHABIAH MARBEL &amp; GRANITE TR LLC</strong></p>
<p><strong>United Arab Emirates</strong></p>
<p><strong>Last Updated: September 3, 2026</strong></p>
<p>NeroCasa reserves the right to update these Terms of Service from time to time. The version published on the website at the relevant time will apply, subject to applicable UAE law and any specific contractual terms agreed with the customer.</p>
`.trim();

const REFUND_BODY = `
<p><strong>Effective Date: September 2, 2026</strong><br>
<strong>Last Updated: September 3, 2026</strong></p>
<p>At <strong>NeroCasa</strong>, every piece is created with care and, in many cases, produced specifically for the customer. Because our marble furniture is made to order and may be manufactured according to individual specifications, returns, cancellations, refunds, and exchanges are subject to the conditions set out below.</p>
<p>This policy applies to purchases made through the NeroCasa website and should be read together with our Terms of Service and Shipping &amp; Delivery Policy.</p>
<p>Nothing in this policy excludes, limits, or overrides any mandatory rights or remedies available to consumers under applicable laws and regulations of the United Arab Emirates.</p>

<h2>1. MADE-TO-ORDER PRODUCTS</h2>
<p>NeroCasa operates primarily on a <strong>made-to-order model</strong>.</p>
<p>Products may be manufactured specifically according to the customer's selected or approved specifications, including:</p>
<ul>
<li>Dimensions</li>
<li>Marble type</li>
<li>Marble colour</li>
<li>Marble selection</li>
<li>Shape</li>
<li>Edge profile</li>
<li>Base design</li>
<li>Base material</li>
<li>Finish</li>
<li>Custom design requirements</li>
<li>Other agreed specifications</li>
</ul>
<p>Because a made-to-order piece may be manufactured specifically for an individual customer, it may not be suitable for resale in the same way as standard retail stock.</p>
<p>Accordingly, a customer's right to cancel, return, or exchange a product solely because of a change of mind may be restricted once production has commenced, subject always to applicable UAE law.</p>

<h2>2. ORDER CANCELLATION</h2>
<h3>2.1 Cancellation Before Production</h3>
<p>A customer may request cancellation <strong>before production begins</strong>.</p>
<p>Where NeroCasa approves the cancellation, any applicable refund will be processed to the original payment method, subject to applicable law.</p>
<p>A cancellation request should be submitted as soon as possible because orders may move into production shortly after payment and confirmation.</p>
<h3>2.2 Cancellation After Production Begins</h3>
<p>Once production has commenced, the order may no longer be cancellable solely because the customer has changed their mind.</p>
<p>This is because materials, labour, cutting, fabrication, finishing, and other production resources may already have been committed specifically to the order.</p>
<p>Any request received after production has commenced will be reviewed based on the status and nature of the order.</p>
<p>This restriction does <strong>not</strong> affect applicable rights relating to products that are defective, damaged, incorrect, incomplete, or materially different from what was agreed.</p>

<h2>3. CHANGE-OF-MIND RETURNS</h2>
<p>For products that qualify for a change-of-mind return, a return request must generally be made within <strong>7 calendar days from the date of delivery</strong>.</p>
<p>To be considered for a change-of-mind return, the product must:</p>
<ul>
<li>Be unused;</li>
<li>Remain in its original condition;</li>
<li>Not have been damaged after delivery;</li>
<li>Not have been altered, modified, or repaired;</li>
<li>Include applicable original components and accessories; and</li>
<li>Be in a condition that reasonably permits resale.</li>
</ul>
<p>A return request does not automatically constitute an approved return.</p>
<p>NeroCasa may review the product and the circumstances of the request before confirming whether the return is accepted.</p>
<p><strong>Important</strong></p>
<p>Because NeroCasa products are made to order, <strong>custom-made or personalised products may not qualify for a change-of-mind return once production has commenced</strong>, subject to mandatory rights under UAE law.</p>

<h2>4. DEFECTIVE, DAMAGED, INCORRECT, OR NON-CONFORMING PRODUCTS</h2>
<p>NeroCasa takes responsibility for addressing products that are defective, damaged, incomplete, incorrect, or materially different from what was agreed at the time of purchase, subject to applicable law.</p>
<p>If you believe there is an issue with your order, contact NeroCasa as soon as reasonably possible.</p>
<p>Please provide:</p>
<ul>
<li>Order number;</li>
<li>Customer name;</li>
<li>Photographs of the product;</li>
<li>Clear photographs of the affected area;</li>
<li>Video where useful;</li>
<li>Description of the issue; and</li>
<li>Any other information reasonably requested by NeroCasa.</li>
</ul>
<p>After assessment, NeroCasa may provide an appropriate remedy depending on the circumstances and applicable law.</p>
<p>This may include:</p>
<ul>
<li>Repair;</li>
<li>Replacement;</li>
<li>Correction;</li>
<li>Completion of missing components;</li>
<li>Collection and re-delivery; or</li>
<li>Refund.</li>
</ul>
<p>The appropriate remedy will depend on the nature and seriousness of the issue and the circumstances of the order.</p>

<h2>5. DAMAGE DURING DELIVERY OR INSTALLATION</h2>
<p>NeroCasa provides delivery and installation for applicable furniture orders within the UAE.</p>
<p>Our delivery and installation teams are expected to take reasonable care when handling your furniture.</p>
<p>Customers should inspect the product during or immediately following delivery and installation.</p>
<p>If visible damage is identified:</p>
<ol>
<li>Notify the delivery or installation team immediately where possible;</li>
<li>Take clear photographs and/or video;</li>
<li>Keep the product and packaging in the condition received where reasonably possible; and</li>
<li>Contact NeroCasa with your order information.</li>
</ol>
<p>Where assessment determines that damage occurred during transportation or installation by NeroCasa or an appointed delivery/installation provider, NeroCasa will arrange an appropriate resolution in accordance with applicable law.</p>

<h2>6. NATURAL MARBLE IS UNIQUE</h2>
<p>Marble is a natural stone, and <strong>no two slabs are guaranteed to be identical</strong>.</p>
<p>Natural variations may include:</p>
<ul>
<li>Veining;</li>
<li>Colour;</li>
<li>Tone;</li>
<li>Texture;</li>
<li>Mineral deposits;</li>
<li>Patterns;</li>
<li>Natural pores;</li>
<li>Fossils;</li>
<li>Mineral markings;</li>
<li>Fissures or other natural stone characteristics.</li>
</ul>
<p>These characteristics are inherent to natural marble.</p>
<p>A finished piece may therefore differ from:</p>
<ul>
<li>Website photographs;</li>
<li>Social media photographs;</li>
<li>Display pieces;</li>
<li>Previous orders;</li>
<li>Other pieces made from the same marble type; or</li>
<li>Digital representations shown on a screen.</li>
</ul>
<p>Such natural variation does not automatically constitute a defect.</p>
<p>Where a specific marble slab or selection has been approved by the customer, NeroCasa will make reasonable efforts to manufacture the order consistently with that selection. However, the final piece remains subject to the natural characteristics of the stone.</p>
<p><strong>Exact replication of a photograph, veining pattern, shade, or mineral marking cannot be guaranteed.</strong></p>

<h2>7. DIMENSIONS AND CUSTOMER-APPROVED SPECIFICATIONS</h2>
<p>Customers are responsible for carefully reviewing the dimensions and specifications of their order before production begins.</p>
<p>This includes, where applicable:</p>
<ul>
<li>Length;</li>
<li>Width;</li>
<li>Height;</li>
<li>Thickness;</li>
<li>Marble selection;</li>
<li>Finish;</li>
<li>Shape;</li>
<li>Base specifications;</li>
<li>Edge profile; and</li>
<li>Other custom requirements.</li>
</ul>
<p>Where a customer supplies or approves measurements or specifications, NeroCasa will manufacture according to the approved information.</p>
<p>If incorrect information is supplied or approved by the customer, NeroCasa may not be responsible for resulting sizing, fit, access, or compatibility issues unless the issue resulted from an error by NeroCasa.</p>
<p>Customers should ensure that the intended location can accommodate the completed product, including its delivery and installation requirements.</p>

<h2>8. CUSTOMER ACCESS AND DELIVERY CONDITIONS</h2>
<p>Before ordering, customers should consider whether the product can reasonably be transported into the intended property.</p>
<p>Customers should inform NeroCasa of relevant restrictions, including:</p>
<ul>
<li>Narrow entrances;</li>
<li>Small elevators;</li>
<li>Stairs;</li>
<li>Restricted building access;</li>
<li>Limited parking;</li>
<li>Security restrictions;</li>
<li>Restricted delivery hours; or</li>
<li>Other access limitations.</li>
</ul>
<p>Where a product cannot be delivered or installed because of conditions attributable to the customer or the property, NeroCasa may need to reschedule delivery or agree an alternative arrangement.</p>
<p>Reasonable additional costs arising from customer-caused delivery difficulties may apply where communicated and agreed.</p>

<h2>9. CHANGE-OF-MIND RETURNS — COSTS</h2>
<p>Where NeroCasa approves a change-of-mind return, the customer may be responsible for reasonable costs associated with:</p>
<ul>
<li>Collection;</li>
<li>Transportation;</li>
<li>Handling;</li>
<li>Re-delivery where applicable; or</li>
<li>Other return logistics.</li>
</ul>
<p>Any applicable costs will be communicated where reasonably possible.</p>
<p>This section does not apply in a manner that would unlawfully reduce a customer's mandatory rights under UAE law.</p>

<h2>10. PRODUCTS DAMAGED AFTER DELIVERY</h2>
<p>NeroCasa is not generally responsible for damage caused after successful delivery and installation where the damage results from circumstances attributable to the customer or a third party.</p>
<p>Examples may include:</p>
<ul>
<li>Improper use;</li>
<li>Accidental impact;</li>
<li>Improper movement;</li>
<li>Third-party installation;</li>
<li>Unauthorised repairs;</li>
<li>Unauthorised modifications;</li>
<li>Excessive heat;</li>
<li>Scratches occurring after delivery;</li>
<li>Use of inappropriate chemicals or cleaning products;</li>
<li>Failure to follow care instructions; or</li>
<li>Other misuse or negligence after delivery.</li>
</ul>
<p>This does not affect rights relating to an underlying manufacturing defect or another issue for which NeroCasa is legally responsible.</p>

<h2>11. REFUNDS</h2>
<p>Where a refund is approved, NeroCasa will generally process the refund to the <strong>original payment method used for the order</strong>, unless another method is agreed or required by applicable law.</p>
<p>Once NeroCasa has processed the refund, the time required for the funds to appear in the customer's account may depend on:</p>
<ul>
<li>The customer's bank;</li>
<li>Card issuer;</li>
<li>Payment provider; or</li>
<li>Other financial institution.</li>
</ul>
<p>NeroCasa is not responsible for processing delays caused by third-party financial institutions after the refund has been successfully initiated by NeroCasa.</p>

<h2>12. EXCHANGES</h2>
<p>Customers may request an exchange where appropriate.</p>
<p>Exchange requests are subject to:</p>
<ul>
<li>The condition of the product;</li>
<li>Whether the product is made to order;</li>
<li>Whether production has commenced;</li>
<li>Availability of the requested replacement;</li>
<li>The reason for the exchange; and</li>
<li>Applicable UAE law.</li>
</ul>
<p>Products that are defective, damaged, incorrect, incomplete, or materially non-conforming will be assessed and addressed in accordance with applicable law.</p>
<p>A change-of-mind exchange may not be available for custom-made or personalised products once production has commenced.</p>

<h2>13. CUSTOM-MADE PRODUCTS</h2>
<p>Custom-made products require particular consideration because they may be manufactured specifically according to an individual customer's requirements.</p>
<p>Once production has commenced, a customer may not be able to cancel, return, or exchange a custom-made product solely because of a change of mind.</p>
<p>This may include products manufactured according to:</p>
<ul>
<li>Customer dimensions;</li>
<li>Customer drawings;</li>
<li>Customer-provided references;</li>
<li>Customer-selected materials;</li>
<li>Custom shapes;</li>
<li>Custom bases;</li>
<li>Custom finishes; or</li>
<li>Other individually requested specifications.</li>
</ul>
<p>This section does not remove any mandatory rights relating to defective, damaged, incorrect, or non-conforming goods under UAE law.</p>

<h2>14. RETURN CONDITION</h2>
<p>Where a return is approved, NeroCasa may require the product to be returned in an appropriate condition.</p>
<p>The customer must not:</p>
<ul>
<li>Modify the product;</li>
<li>Repair the product without approval;</li>
<li>Alter the product;</li>
<li>Remove essential components;</li>
<li>Deliberately damage the product; or</li>
<li>Subject the product to unreasonable use before return.</li>
</ul>
<p>NeroCasa may inspect the product before confirming the final return or refund outcome.</p>

<h2>15. INSPECTION AND ASSESSMENT</h2>
<p>NeroCasa may reasonably request photographs, videos, measurements, documentation, or a physical inspection to determine the nature of an issue.</p>
<p>Where physical inspection or collection is required, NeroCasa will coordinate the process with the customer.</p>
<p>Assessment may consider:</p>
<ul>
<li>The condition of the product;</li>
<li>The original order specifications;</li>
<li>The production details;</li>
<li>The reported issue;</li>
<li>Delivery and installation circumstances;</li>
<li>Whether the issue is a natural characteristic of marble;</li>
<li>Whether the issue resulted from customer use or damage; and</li>
<li>Any other relevant circumstances.</li>
</ul>

<h2>16. HOW TO REQUEST A RETURN, REFUND, OR EXCHANGE</h2>
<p>To submit a request, contact NeroCasa using the contact details published on our website.</p>
<p>Please provide:</p>
<p><strong>Order Number:</strong><br>
<strong>Customer Name:</strong><br>
<strong>Phone Number:</strong><br>
<strong>Email Address:</strong><br>
<strong>Date of Delivery:</strong><br>
<strong>Reason for Request:</strong><br>
<strong>Photographs / Videos:</strong></p>
<p>For damaged or defective products, clear photographs and video can significantly assist with assessment.</p>
<p>NeroCasa will review the request and communicate the next steps.</p>
<p>Submitting a request does not guarantee that a return, exchange, replacement, repair, or refund will be approved. Each request will be assessed according to the circumstances, this policy, and applicable UAE law.</p>

<h2>17. UNDELIVERABLE OR REFUSED ORDERS</h2>
<p>If a customer refuses or prevents delivery of an order without a valid reason, NeroCasa may contact the customer to arrange an alternative delivery.</p>
<p>For made-to-order or custom products, refusing delivery does not automatically cancel the customer's payment obligation or create an automatic right to a refund.</p>
<p>Any resulting cancellation, return, storage, collection, or transportation arrangements will be assessed under this policy and applicable UAE law.</p>

<h2>18. NO WAIVER OF LEGAL RIGHTS</h2>
<p>Nothing in this policy is intended to exclude, restrict, or waive any consumer right, guarantee, remedy, or protection that cannot legally be excluded under the laws and regulations of the United Arab Emirates.</p>
<p>If applicable law provides a customer with a mandatory right that conflicts with a provision of this policy, the mandatory legal requirement will prevail to the extent of the conflict.</p>

<h2>19. POLICY ABUSE</h2>
<p>NeroCasa reserves the right to investigate return and refund requests where there is reasonable concern regarding misuse of the return process, false claims, intentional damage, fraudulent activity, or other abuse.</p>
<p>This does not affect legitimate consumer rights or remedies available under applicable UAE law.</p>

<h2>20. CONTACT US</h2>
<p>For return, refund, exchange, damage, or product-related enquiries, please contact:</p>
<p><strong>NeroCasa</strong><br>
United Arab Emirates</p>
<p><strong>Website:</strong> <a href="https://nerocasa.com/">https://nerocasa.com/</a><br>
<strong>Email:</strong> <a href="mailto:nerocasamarbles@gmail.com">nerocasamarbles@gmail.com</a><br>
<strong>Phone / WhatsApp:</strong> +971 50 858 8828</p>

<h2>21. CHANGES TO THIS POLICY</h2>
<p>NeroCasa may update this Return &amp; Refund Policy from time to time to reflect changes to our products, services, operations, or applicable legal requirements.</p>
<p>The version applicable to an order will generally be the version in effect when that order was placed, subject to any mandatory requirements of UAE law.</p>
<p><strong>Effective Date: September 2, 2026</strong><br>
<strong>Last Updated: September 3, 2026</strong></p>
`.trim();

function execute(query, variables, allowMutations = false) {
  const dir = mkdtempSync(join(tmpdir(), 'nc-legal-'));
  writeFileSync(join(dir, 'q.graphql'), query, 'utf8');
  const args = ['store', 'execute', '--store', store, '--query-file', join(dir, 'q.graphql'), '--json'];
  if (variables) {
    writeFileSync(join(dir, 'v.json'), JSON.stringify(variables), 'utf8');
    args.push('--variable-file', join(dir, 'v.json'));
  }
  if (allowMutations) args.push('--allow-mutations');
  try {
    return JSON.parse(
      execFileSync(shopifyCmd, args, {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: isWin,
        env: { ...process.env, SHOPIFY_CLI_AGENT_INFO: 'n:cursor|v:1|p:cursor|m:legal-pages' },
      }),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function updatePage(page, title, body, seoTitle, seoDesc) {
  console.log(`Updating ${page.handle}...`);
  const updated = execute(
    `mutation UpdatePage($id: ID!, $page: PageUpdateInput!) {
      pageUpdate(id: $id, page: $page) {
        page { id handle title }
        userErrors { message field }
      }
    }`,
    { id: page.id, page: { title, body, isPublished: true } },
    true,
  );
  const errs = updated.pageUpdate?.userErrors || [];
  if (errs.length) throw new Error(`${page.handle}: ${errs.map((e) => e.message).join('; ')}`);
  console.log(`  + ${updated.pageUpdate.page.title}`);

  execute(
    `mutation Seo($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors { message }
      }
    }`,
    {
      metafields: [
        { ownerId: page.id, namespace: 'global', key: 'title_tag', type: 'single_line_text_field', value: seoTitle },
        { ownerId: page.id, namespace: 'global', key: 'description_tag', type: 'single_line_text_field', value: seoDesc },
      ],
    },
    true,
  );
}

const pages = execute(`query { pages(first: 50) { nodes { id handle title } } }`).pages?.nodes || [];
const terms = pages.find((p) => p.handle === 'terms');
const refunds = pages.find((p) => p.handle === 'refunds');

if (!terms) throw new Error('terms page not found');
if (!refunds) throw new Error('refunds page not found');

updatePage(
  terms,
  'Terms of Service',
  TERMS_BODY,
  'Terms of Service | NeroCasa',
  'Terms of Service for NeroCasa marble furniture purchases, custom orders, delivery and website use in the UAE.',
);

updatePage(
  refunds,
  'Return & Refund Policy',
  REFUND_BODY,
  'Return & Refund Policy | NeroCasa',
  'Return, refund, cancellation and exchange policy for NeroCasa made-to-order marble furniture in the UAE.',
);

console.log('\nDone. Both policies are live in Admin and on the storefront.');
