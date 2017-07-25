import slots from '../../src/time/slots';
import signature from '../../src/transactions/signature';

describe('signature.js', function () {

	it('should be ok', function () {
		(signature).should.be.ok();
	});

	it('should be object', function () {
		(signature).should.be.type('object');
	});

	it('should have properties', function () {
		(signature).should.have.property('createSignature');
	});

	describe('#createSignature', function () {

		var createSignature = signature.createSignature;
		var sgn = null;

		it('should be function', function () {
			(createSignature).should.be.type('function');
		});

		it('should create signature transaction', function () {
			sgn = createSignature('secret', 'second secret');
			(sgn).should.be.ok();
			(sgn).should.be.type('object');
		});

		describe('timestamp', function () {
			var now;
			var clock;

			beforeEach(function () {
				now = new Date();
				clock = sinon.useFakeTimers(now, 'Date');
			});

			afterEach(function () {
				clock.restore();
			});

			it('should use time slots to get the time for the timestamp', function () {
				sgn = createSignature('secret', 'second secret');
				(sgn).should.have.property('timestamp').and.be.equal(slots.getTime());
			});

			it('should use time slots with an offset to get the time for the timestamp', function () {
				var offset = -10;

				sgn = createSignature('secret', 'second secret', offset);

				(sgn).should.have.property('timestamp').and.be.equal(slots.getTime() + offset);
			});

		});

		describe('returned signature transaction', function () {

			it('should have empty recipientId', function () {
				(sgn).should.have.property('recipientId').equal(null);
			});

			it('should have amount equal 0', function () {
				(sgn.amount).should.be.type('number').equal(0);
			});

			it('should have asset', function () {
				(sgn.asset).should.be.type('object');
				(sgn.asset).should.be.not.empty();
			});

			it('should have signature inside asset', function () {
				(sgn.asset).should.have.property('signature');
			});

			describe('signature asset', function () {

				it('should be ok', function () {
					(sgn.asset.signature).should.be.ok();
				});

				it('should be object', function () {
					(sgn.asset.signature).should.be.type('object');
				});

				it('should have publicKey property', function () {
					(sgn.asset.signature).should.have.property('publicKey');
				});

				it('should have publicKey in hex', function () {
					(sgn.asset.signature).should.have.property('publicKey').and.be.type('string').and.be.hexString();
				});

				it('should have publicKey in 32 bytes', function () {
					var publicKey = Buffer.from(sgn.asset.signature.publicKey, 'hex');
					(publicKey.length).should.be.equal(32);
				});

			});

		});

	});

});
